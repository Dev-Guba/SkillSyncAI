import crypto from "node:crypto";
import { Op } from "sequelize";

import sequelize from "../config/db.js";
import { UserProfile } from "../model/relation.js";
import EmailVerification from "../model/EmailVerification.js";
import { sendVerificationEmail } from "./emailServices.js";

/*
| Email verification with 6-digit codes.
|
| Two stages:
|  - Sign-up: the user has no profile yet. The verified address is kept on
|    the Email_Verifications row (verified_at), and profile setup reuses it.
|  - After profile setup: the profile's email/email_verified_at are updated.
|    Changing the email sends a code to the new address; the profile only
|    switches once it is entered.
*/

const CODE_EXPIRY_MINUTES = 15;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function hashCode(user_id, email, code) {
    return crypto
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(`verify:${user_id}:${email}:${code}`)
        .digest("hex");
}

function safeEqualHex(a, b) {
    const x = Buffer.from(a, "hex");
    const y = Buffer.from(b, "hex");
    return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export const normalizeEmail = (email) =>
    String(email || "").trim().toLowerCase();

/*
| An address is taken if another user's profile uses it, or another user
| verified it at sign-up and hasn't set up a profile yet.
*/
export async function isEmailTaken(email, user_id = null, transaction = undefined) {
    const notMe = user_id ? { [Op.ne]: user_id } : { [Op.ne]: null };

    const profile = await UserProfile.findOne({
        where: { email, user_id: notMe },
        attributes: ["user_id"],
        transaction,
    });
    if (profile) return true;

    const verified = await EmailVerification.findAll({
        where: { email, user_id: notMe, verified_at: { [Op.ne]: null } },
        attributes: ["user_id"],
        transaction,
    });
    if (!verified.length) return false;

    const withProfile = await UserProfile.count({
        where: { user_id: verified.map((v) => v.user_id) },
        transaction,
    });
    // Users who verified it but have a profile now use their profile email
    return withProfile < new Set(verified.map((v) => v.user_id)).size;
}

async function latestOpenCode(user_id) {
    return EmailVerification.findOne({
        where: {
            user_id,
            is_used: false,
            expires_at: { [Op.gt]: new Date() },
        },
        order: [["created_at", "DESC"], ["id", "DESC"]],
    });
}

async function latestVerifiedSignupEmail(user_id) {
    const row = await EmailVerification.findOne({
        where: { user_id, verified_at: { [Op.ne]: null } },
        order: [["verified_at", "DESC"], ["id", "DESC"]],
        attributes: ["email"],
    });
    return row ? row.email : null;
}

// True if this user already confirmed `email` with a code
export async function isEmailVerifiedForUser(user_id, email) {
    const row = await EmailVerification.findOne({
        where: {
            user_id,
            email: normalizeEmail(email),
            verified_at: { [Op.ne]: null },
        },
        attributes: ["id"],
    });
    return Boolean(row);
}

// { has_profile, email, verified }
async function currentEmail(user_id) {
    const profile = await UserProfile.findOne({
        where: { user_id },
        attributes: ["email", "email_verified_at"],
    });

    if (profile) {
        return {
            has_profile: true,
            email: normalizeEmail(profile.email),
            verified: Boolean(profile.email_verified_at),
        };
    }

    const verifiedEmail = await latestVerifiedSignupEmail(user_id);
    if (verifiedEmail) {
        return { has_profile: false, email: verifiedEmail, verified: true };
    }

    // Signed up, code sent, not entered yet
    const open = await latestOpenCode(user_id);
    return { has_profile: false, email: open ? open.email : null, verified: false };
}

/*
| Sends a 6-digit code to `email`, or to the user's current email when
| omitted (e.g. "Resend code").
*/
export async function sendVerificationCode(user_id, email = null) {
    const state = await currentEmail(user_id);
    const target = normalizeEmail(email || state.email);

    if (!target) {
        throw httpError(400, "Please enter your email address.");
    }
    if (!EMAIL_PATTERN.test(target)) {
        throw httpError(400, "Please enter a valid email address.");
    }
    if (target === state.email && state.verified) {
        throw httpError(400, "This email is already verified.");
    }
    if (await isEmailTaken(target, user_id)) {
        throw httpError(409, "That email is already used by another account.");
    }

    const previous = await latestOpenCode(user_id);
    if (previous && previous.email === target) {
        const ageSeconds = (Date.now() - new Date(previous.created_at).getTime()) / 1000;
        if (ageSeconds < RESEND_COOLDOWN_SECONDS) {
            throw httpError(
                429,
                `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - ageSeconds)} seconds before requesting another code.`
            );
        }
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    const record = await sequelize.transaction(async (transaction) => {
        // Only the newest code works
        await EmailVerification.update(
            { is_used: true },
            { where: { user_id, is_used: false }, transaction }
        );

        return EmailVerification.create({
            user_id,
            email: target,
            code_hash: hashCode(user_id, target, code),
            expires_at: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000),
            attempts: 0,
            is_used: false,
        }, { transaction });
    });

    try {
        await sendVerificationEmail(target, code, CODE_EXPIRY_MINUTES);
    } catch (error) {
        await record.update({ is_used: true });
        console.error("Verification email failed:", error);
        throw httpError(502, "We couldn't send the verification email. Please try again.");
    }

    return { email: target, expires_in_minutes: CODE_EXPIRY_MINUTES };
}

export async function verifyEmailCode(user_id, code) {
    const submitted = String(code || "").trim();
    if (!/^\d{6}$/.test(submitted)) {
        throw httpError(400, "Enter the 6-digit code from the email.");
    }

    return sequelize.transaction(async (transaction) => {
        const record = await EmailVerification.findOne({
            where: { user_id, is_used: false },
            order: [["created_at", "DESC"], ["id", "DESC"]],
            lock: transaction.LOCK.UPDATE,
            transaction,
        });

        if (!record || new Date(record.expires_at) <= new Date()) {
            throw httpError(400, "This code has expired. Please request a new one.");
        }

        if (!safeEqualHex(hashCode(user_id, record.email, submitted), record.code_hash)) {
            record.attempts += 1;
            if (record.attempts >= MAX_ATTEMPTS) record.is_used = true;
            await record.save({ transaction });

            throw httpError(
                400,
                record.is_used
                    ? "Too many wrong codes. Please request a new one."
                    : "That code isn't right. Please check the email and try again."
            );
        }

        // Someone else may have taken this address since the code was sent
        if (await isEmailTaken(record.email, user_id, transaction)) {
            record.is_used = true;
            await record.save({ transaction });
            throw httpError(409, "That email is already used by another account.");
        }

        const now = new Date();
        record.is_used = true;
        record.verified_at = now;
        await record.save({ transaction });

        const profile = await UserProfile.findOne({
            where: { user_id },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (profile) {
            await profile.update(
                { email: record.email, email_verified_at: now },
                { transaction }
            );
        }

        return { email: record.email, verified: true, has_profile: Boolean(profile) };
    });
}

// What the Verify Email and Profile Setup pages show
export async function getVerificationStatus(user_id) {
    const state = await currentEmail(user_id);
    const open = await latestOpenCode(user_id);

    return {
        has_profile: state.has_profile,
        email: state.email,
        verified: state.verified,
        // A different address waiting for its code (e.g. an email change)
        pending_email: open && open.email !== state.email ? open.email : null,
        code_sent_to: open ? open.email : null,
    };
}
