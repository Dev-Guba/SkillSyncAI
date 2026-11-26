import { sendContactEmail } from "../services/emailServices.js";

const LIMITS = { name: 100, email: 150, subject: 150, message: 3000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory limit so the form can't be used to flood the inbox:
// at most 5 messages per IP address per hour.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const recentByIp = new Map(); // ip -> [timestamps]

function isRateLimited(ip) {
    const now = Date.now();
    const recent = (recentByIp.get(ip) || []).filter(
        (t) => now - t < RATE_WINDOW_MS
    );

    if (recent.length >= RATE_LIMIT) {
        recentByIp.set(ip, recent);
        return true;
    }

    recent.push(now);
    recentByIp.set(ip, recent);

    // keep the map from growing forever
    if (recentByIp.size > 5000) {
        recentByIp.delete(recentByIp.keys().next().value);
    }

    return false;
}

export async function handleContactMessage(req, res) {
    const clean = (value) =>
        typeof value === "string" ? value.trim() : "";

    const name = clean(req.body?.name);
    const email = clean(req.body?.email);
    const subject = clean(req.body?.subject);
    const message = clean(req.body?.message);

    // Hidden form field that people never fill in; bots usually do
    if (clean(req.body?.website)) {
        return res.status(200).json({ success: true, message: "Message sent." });
    }

    const errors = {};
    if (!name) errors.name = "Please enter your name.";
    if (!email) errors.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email.";
    if (!message) errors.message = "Please write a message.";
    else if (message.length < 10) errors.message = "Please write a little more (at least 10 characters).";

    for (const [field, max] of Object.entries(LIMITS)) {
        const value = { name, email, subject, message }[field];
        if (value.length > max) {
            errors[field] = `Please keep this under ${max} characters.`;
        }
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Please check the highlighted fields.",
            errors,
        });
    }

    if (isRateLimited(req.ip)) {
        return res.status(429).json({
            success: false,
            message: "You've sent several messages already. Please try again later.",
        });
    }

    try {
        await sendContactEmail({ name, email, subject, message });

        return res.status(200).json({
            success: true,
            message: "Thanks! Your message has been sent. We'll reply by email.",
        });
    } catch (error) {
        console.error("Contact form email error:", error);

        return res.status(500).json({
            success: false,
            message: "Your message couldn't be sent right now. Please try again later.",
        });
    }
}
