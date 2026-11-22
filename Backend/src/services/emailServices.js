import "dotenv/config";
import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.OTP_USER;
  const pass = process.env.SMTP_PASS || process.env.OTP_PASSWORD_OTP;

  if (!user || !pass) {
    throw new Error("Missing SMTP_USER/SMTP_PASS in Backend/.env");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOTPEmail(email, otp) {
  const sender = process.env.SMTP_USER || process.env.OTP_USER;
  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"SkillSyncAI" <${sender}>`,
      to: email,
      subject: "Password Reset Verification",
      text: `Your SkillSyncAI verification code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>SkillSyncAI</h2>
          <p>You requested to reset your password.</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p>Your verification code expires in 10 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    console.log("OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer SMTP Error:", error);
    throw error;
  }
}