
import crypto from "node:crypto";
import bcrypt from "bcrypt";

import {
    User,
    UserProfile,
    PasswordResetOTP
} from "../model/relation.js";

import { sendOTPEmail } from "./emailServices.js";
import sequelize from "../config/db.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashValue(value) {
    return crypto
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(value)
        .digest("hex");
}

function safeCompare(value1, value2) {
    const a = Buffer.from(value1, "hex");
    const b = Buffer.from(value2, "hex");

    return a.length === b.length &&
        crypto.timingSafeEqual(a, b);
}


// REQUEST PASSWORD RESET
export async function requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        include: [{
            model: UserProfile,
            where: { email: normalizedEmail },
            required: true,
            attributes: ["email"]
        }]
    });

    // Generic response for unknown emails
    if (!user) return;

    const otp = generateOTP();
    const otpHash = hashValue(`${user.user_id}:${otp}`);

    await sequelize.transaction(async (transaction) => {

        await PasswordResetOTP.update(
            { is_used: true },
            {
                where: {
                    user_id: user.user_id,
                    is_used: false
                },
                transaction
            }
        );

        await PasswordResetOTP.create({
            user_id: user.user_id,
            otp_hash: otpHash,
            expires_at: new Date(
                Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
            ),
            attempts: 0,
            is_used: false
        }, { transaction });

    });

    // Send only after database commit
    try {
        await sendOTPEmail(normalizedEmail, otp);
    } catch (error) {
        await PasswordResetOTP.update(
            { is_used: true },
            {
                where: {
                    user_id: user.user_id,
                    otp_hash: otpHash,
                    is_used: false
                }
            }
        );

        throw new Error("Unable to send verification email.");
    }
}


// VERIFY OTP
export async function verifyPasswordOTP(email, otp) {
    const normalizedEmail = email.trim().toLowerCase();

    return await sequelize.transaction(async (transaction) => {

        const user = await User.findOne({
            include: [{
                model: UserProfile,
                where: { email: normalizedEmail },
                required: true,
                attributes: ["email"]
            }],
            transaction
        });

        if (!user) {
            throw new Error("Invalid or expired OTP.");
        }

        const record = await PasswordResetOTP.findOne({
            where: {
                user_id: user.user_id,
                is_used: false
            },
            order: [["created_at", "DESC"]],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!record || record.expires_at <= new Date()) {
            throw new Error("Invalid or expired OTP.");
        }

        if (record.attempts >= MAX_OTP_ATTEMPTS) {
            record.is_used = true;
            await record.save({ transaction });

            throw new Error("Too many attempts. Request a new OTP.");
        }

        const submittedHash = hashValue(
            `${user.user_id}:${otp}`
        );

        if (!safeCompare(submittedHash, record.otp_hash)) {
            record.attempts += 1;

            if (record.attempts >= MAX_OTP_ATTEMPTS) {
                record.is_used = true;
            }

            await record.save({ transaction });

            throw new Error("Invalid or expired OTP.");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        record.reset_token_hash = hashValue(resetToken);
        record.is_used = true;

        await record.save({ transaction });

        return { resetToken };
    });
}


// RESET PASSWORD
export async function resetUserPassword(resetToken, newPassword) {
    const tokenHash = hashValue(resetToken);

    return await sequelize.transaction(async (transaction) => {

        const record = await PasswordResetOTP.findOne({
            where: {
                reset_token_hash: tokenHash,
                is_used: true,
                expires_at: {
                    [sequelize.Sequelize.Op.gt]: new Date()
                }
            },
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (!record) {
            throw new Error("Invalid or expired reset token.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
            { password: hashedPassword },
            {
                where: { user_id: record.user_id },
                transaction
            }
        );

        record.reset_token_hash = null;
        await record.save({ transaction });

        return true;
    });
}
