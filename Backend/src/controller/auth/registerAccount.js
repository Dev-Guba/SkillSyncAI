import bcrypt from "bcrypt";
import createToken from "../../utils/createToken.js";
import { User } from "../../model/relation.js";
import {
    EMAIL_PATTERN,
    isEmailTaken,
    normalizeEmail,
    sendVerificationCode,
} from "../../services/emailVerificationServices.js";

const STUDENT_ROLE_ID = 3;

export async function registerAccount(req, res) {
    try {
        const { password } = req.body || {};
        const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
        const email = normalizeEmail(req.body?.email);

        // Public sign-up always creates a student account. The role used to
        // come from the request, which let anyone register as an admin.
        const role_id = STUDENT_ROLE_ID;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username, email and password are required." });
        }

        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        if (await isEmailTaken(email)) {
            return res.status(409).json({ message: "That email is already used by another account." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: passwordHash, role_id });

        // Email a code right away; the next screen asks for it. If sending
        // fails, the account still exists and that screen offers "Resend".
        let verification_sent = false;
        try {
            await sendVerificationCode(newUser.user_id, email);
            verification_sent = true;
        } catch (error) {
            console.error("Sign-up verification code failed:", error.message);
        }

        const token = createToken(newUser);
        res.status(201).json({
            success: true,
            message: "Account registered successfully",
            // never send the password hash back
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                role_id: newUser.role_id,
            },
            verification_sent,
            token
        });

    } catch (error) {
        console.error("Error registering account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
