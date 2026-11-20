import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendOTPEmail(email, otp) {
    return transporter.sendMail({
        from: `"SkillSyncAI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Verification",
        html: `
            <div style="font-family: Arial;">
                <h2>SkillSyncAI</h2>
                <p>You requested to reset your password.</p>
                <h1>${otp}</h1>
                <p>Your verification code expires in 10 minutes.</p>
                <p>If you did not request this, ignore this email.</p>
            </div>
        `
    });
}