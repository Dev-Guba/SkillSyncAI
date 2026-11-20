
import {
    requestPasswordReset,
    verifyPasswordOTP,
    resetUserPassword
} from "../../services/passwordResetServices.js";

export async function requestOTP(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        await requestPasswordReset(email);

        return res.status(200).json({
            success: true,
            message: "If the email is registered, a verification code will be sent."
        });

    } catch (error) {
        console.error("Request OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process password reset request."
        });
    }
}

export async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const result = await verifyPasswordOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
            resetToken: result.resetToken
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Invalid or expired OTP."
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        await resetUserPassword(resetToken, newPassword);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Password Reset Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Unable to reset password."
        });
    }
}
