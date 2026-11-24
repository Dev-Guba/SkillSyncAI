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

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Landing page Contact form. Goes to CONTACT_EMAIL (or the SMTP account
// itself); "Reply" in the inbox answers the visitor directly.
export async function sendContactEmail({ name, email, subject, message }) {
    const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
    // Keep header fields on one line
    const oneLine = (value) => String(value).replace(/[\r\n]+/g, " ").trim();
    const title = oneLine(subject) || "New message";

    return transporter.sendMail({
        from: `"SkillSyncAI Contact Form" <${process.env.SMTP_USER}>`,
        to,
        replyTo: { name: oneLine(name), address: email },
        subject: `[Contact] ${title}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `
            <div style="font-family: Arial; line-height: 1.5;">
                <h2>New message from the SkillSyncAI contact form</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}<br>
                <strong>Email:</strong> ${escapeHtml(email)}<br>
                <strong>Subject:</strong> ${escapeHtml(title)}</p>
                <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
                <p style="color: #888; font-size: 12px;">Reply to this email to answer ${escapeHtml(name)} directly.</p>
            </div>
        `
    });
}

export async function sendVerificationEmail(email, code, expiresInMinutes) {
    return transporter.sendMail({
        from: `"SkillSyncAI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your email for SkillSyncAI",
        text: `Your SkillSyncAI verification code is ${code}. It expires in ${expiresInMinutes} minutes. If you didn't request this, you can ignore this email.`,
        html: `
            <div style="font-family: Arial;">
                <h2>SkillSyncAI</h2>
                <p>Use this code to verify your email address:</p>
                <h1>${code}</h1>
                <p>The code expires in ${expiresInMinutes} minutes.</p>
                <p>If you didn't request this, you can ignore this email.</p>
            </div>
        `
    });
}

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