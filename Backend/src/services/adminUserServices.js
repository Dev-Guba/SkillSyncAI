import bcrypt from "bcrypt";

import sequelize from "../config/db.js";
import { forgetAccountStatus } from "../middleware/verifyToken.js";
import {
    User,
    UserProfile,
    UserSkill,
    UserInterest,
    UserJobTitle,
    PasswordResetOTP,
} from "../model/relation.js";
import EmailVerification from "../model/EmailVerification.js";
import AdminActionLog from "../model/AdminActionLog.js";
import { requestPasswordReset } from "./passwordResetServices.js";

/*
| Admin actions on accounts. Rules:
|  - Admins can't deactivate, demote or delete themselves (ask another admin).
|  - The last active admin can't be demoted, deactivated or deleted.
|  - Deactivate keeps the account, its data and its email (the email stays
|    taken); permanent delete removes everything and frees the email.
|  - Every action is written to Admin_Action_Logs.
*/

export const ADMIN_ROLE_ID = 1;
export const STUDENT_ROLE_ID = 3;
const ROLE_NAMES = { [ADMIN_ROLE_ID]: "Admin", [STUDENT_ROLE_ID]: "Student" };

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

async function logAction(admin, action, target, details = null, transaction) {
    await AdminActionLog.create({
        admin_user_id: admin.user_id,
        admin_username: admin.username,
        target_user_id: target?.user_id ?? null,
        target_username: target?.username ?? null,
        action,
        details: details ? JSON.stringify(details) : null,
    }, { transaction });
}

async function findTarget(user_id, transaction) {
    const id = Number(user_id);
    if (!Number.isInteger(id)) throw httpError(400, "Invalid user.");
    const user = await User.findByPk(id, { transaction, lock: transaction ? transaction.LOCK.UPDATE : undefined });
    if (!user) throw httpError(404, "That account no longer exists.");
    return user;
}

async function activeAdminCount(transaction) {
    return User.count({
        where: { role_id: ADMIN_ROLE_ID, is_active: true },
        transaction,
    });
}

async function assertNotLastAdmin(target, transaction, what) {
    if (Number(target.role_id) === ADMIN_ROLE_ID && target.is_active) {
        if ((await activeAdminCount(transaction)) <= 1) {
            throw httpError(409, `You can't ${what} the last active admin. Make another admin first.`);
        }
    }
}

function assertNotSelf(admin, target, what) {
    if (Number(admin.user_id) === Number(target.user_id)) {
        throw httpError(409, `You can't ${what} your own account. Ask another admin.`);
    }
}

// ---- List ---------------------------------------------------------------

export async function listUsers() {
    const users = await User.findAll({
        attributes: ["user_id", "username", "role_id", "is_active", "deactivated_at", "created_at"],
        include: [{
            model: UserProfile,
            attributes: ["first_name", "last_name", "email", "email_verified_at"],
            required: false,
        }],
        order: [["created_at", "DESC"]],
    });

    return users.map((u) => ({
        user_id: u.user_id,
        username: u.username,
        role_id: u.role_id,
        is_active: u.is_active,
        deactivated_at: u.deactivated_at,
        created_at: u.created_at,
        name: u.UserProfile
            ? `${u.UserProfile.first_name || ""} ${u.UserProfile.last_name || ""}`.trim() || null
            : null,
        email: u.UserProfile?.email || null,
        email_verified: Boolean(u.UserProfile?.email_verified_at),
    }));
}

// ---- Create -------------------------------------------------------------

export async function createAccount(admin, { username, password, role_id }) {
    const name = typeof username === "string" ? username.trim() : "";
    const role = Number(role_id);

    if (!name || typeof password !== "string") {
        throw httpError(400, "Username and password are required.");
    }
    if (name.length > 50) throw httpError(400, "Username must not exceed 50 characters.");
    if (password.length < 8) throw httpError(400, "Password must be at least 8 characters.");
    if (!ROLE_NAMES[role]) throw httpError(400, "Invalid account role.");

    if (await User.findOne({ where: { username: name } })) {
        throw httpError(409, "Username already exists.");
    }

    const user = await sequelize.transaction(async (transaction) => {
        const created = await User.create({
            username: name,
            password: await bcrypt.hash(password, 10),
            role_id: role,
            is_active: true,
        }, { transaction });

        await logAction(admin, "create", created, { role: ROLE_NAMES[role] }, transaction);
        return created;
    });

    return {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
        is_active: true,
        created_at: user.created_at,
        name: null,
        email: null,
        email_verified: false,
    };
}

// ---- Role ---------------------------------------------------------------

export async function changeRole(admin, user_id, role_id) {
    const role = Number(role_id);
    if (!ROLE_NAMES[role]) throw httpError(400, "Invalid account role.");

    return sequelize.transaction(async (transaction) => {
        const target = await findTarget(user_id, transaction);
        if (Number(target.role_id) === role) {
            return { user_id: target.user_id, role_id: role };
        }

        if (role !== ADMIN_ROLE_ID) {
            assertNotSelf(admin, target, "demote");
            await assertNotLastAdmin(target, transaction, "demote");
        }

        const from = ROLE_NAMES[target.role_id] || `Role ${target.role_id}`;
        await target.update({ role_id: role }, { transaction });
        await logAction(admin, "role_change", target, { from, to: ROLE_NAMES[role] }, transaction);

        return { user_id: target.user_id, role_id: role };
    }).finally(() => {
        forgetAccountStatus(user_id);
    });
}

// ---- Deactivate / reactivate -------------------------------------------

export async function setActive(admin, user_id, active) {
    const makeActive = Boolean(active);

    return sequelize.transaction(async (transaction) => {
        const target = await findTarget(user_id, transaction);
        if (Boolean(target.is_active) === makeActive) {
            return { user_id: target.user_id, is_active: makeActive, deactivated_at: target.deactivated_at };
        }

        if (!makeActive) {
            assertNotSelf(admin, target, "deactivate");
            await assertNotLastAdmin(target, transaction, "deactivate");
        }

        const deactivated_at = makeActive ? null : new Date();
        await target.update({ is_active: makeActive, deactivated_at }, { transaction });
        await logAction(admin, makeActive ? "reactivate" : "deactivate", target, null, transaction);

        return { user_id: target.user_id, is_active: makeActive, deactivated_at };
    }).finally(() => {
        // Takes effect on the user's very next request, not after the cache expires
        forgetAccountStatus(user_id);
    });
}

// ---- Password reset -----------------------------------------------------

export async function sendPasswordReset(admin, user_id) {
    const target = await findTarget(user_id);
    if (!target.is_active) {
        throw httpError(409, "This account is deactivated. Reactivate it first.");
    }

    const profile = await UserProfile.findOne({
        where: { user_id: target.user_id },
        attributes: ["email", "email_verified_at"],
    });
    if (!profile?.email || !profile.email_verified_at) {
        throw httpError(409, "This user has no verified email, so a reset code can't be sent.");
    }

    await requestPasswordReset(profile.email);
    await logAction(admin, "password_reset_sent", target, { email: profile.email });

    return { email: profile.email };
}

// ---- Permanent delete ---------------------------------------------------

export async function deleteAccount(admin, user_id, confirmUsername) {
    return sequelize.transaction(async (transaction) => {
        const target = await findTarget(user_id, transaction);

        if (String(confirmUsername || "").trim() !== target.username) {
            throw httpError(400, "Type the username exactly to confirm.");
        }

        assertNotSelf(admin, target, "delete");
        await assertNotLastAdmin(target, transaction, "delete");

        const where = { where: { user_id: target.user_id }, transaction };
        // Remove everything tied to the account explicitly (doesn't rely on
        // database cascade rules). This also frees the email for a new sign-up.
        await UserSkill.destroy(where);
        await UserInterest.destroy(where);
        await UserJobTitle.destroy(where);
        await PasswordResetOTP.destroy(where);
        await EmailVerification.destroy(where);
        await UserProfile.destroy(where);
        await User.destroy({ where: { user_id: target.user_id }, transaction });

        await logAction(admin, "delete", target, { role: ROLE_NAMES[target.role_id] }, transaction);

        return { user_id: target.user_id, username: target.username };
    }).finally(() => {
        forgetAccountStatus(user_id);
    });
}

// ---- Log ----------------------------------------------------------------

export async function listActions(limit = 50) {
    const rows = await AdminActionLog.findAll({
        order: [["created_at", "DESC"], ["id", "DESC"]],
        limit: Math.min(Math.max(Number(limit) || 50, 1), 200),
    });

    return rows.map((r) => {
        let details = null;
        try { details = r.details ? JSON.parse(r.details) : null; } catch { details = null; }
        return {
            id: r.id,
            action: r.action,
            admin_username: r.admin_username,
            target_user_id: r.target_user_id,
            target_username: r.target_username,
            details,
            created_at: r.created_at,
        };
    });
}

