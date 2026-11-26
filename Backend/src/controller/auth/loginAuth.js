import createToken from "../../utils/createToken.js";
import User from "../../model/User.js";
import bcrypt from "bcrypt";
import {
    loginBlockedFor,
    recordLoginFailure,
    clearLoginFailures,
} from "../../utils/loginRateLimit.js";

// Same message whether the username or the password is wrong, so the login
// form can't be used to find out which usernames exist.
const INVALID_LOGIN = "Invalid username or password.";

const DEACTIVATED_CONTACT =
    process.env.CONTACT_EMAIL || process.env.SMTP_USER || "the SkillSyncAI team";

// Compared against when the username doesn't exist, so both cases take
// about the same time.
const DUMMY_HASH = await bcrypt.hash("not-a-real-password", 10);

export async function login(req, res) {
    try {
        const { username, password } = req.body || {};

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        const wait = loginBlockedFor(req.ip, username);
        if (wait > 0) {
            const minutes = Math.ceil(wait / 60);
            return res.status(429).json({
                message: `Too many failed attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or reset your password.`,
            });
        }

        const user = await User.findOne({ where: { username: username.trim() } });

        const isPasswordValid = await bcrypt.compare(
            password,
            user ? user.password : DUMMY_HASH
        );

        if (!user || !isPasswordValid) {
            recordLoginFailure(req.ip, username);
            return res.status(401).json({ message: INVALID_LOGIN });
        }

        clearLoginFailures(req.ip, username);

        // Only shown after the right password, so it doesn't reveal anything
        // to someone guessing.
        if (!user.is_active) {
            return res.status(403).json({
                message: `Your account has been deactivated. Contact the SkillSyncAI team at ${DEACTIVATED_CONTACT} if you think this is a mistake.`,
                code: "ACCOUNT_DEACTIVATED",
            });
        }

        const payload = {
            user_id: user.user_id,
            role_id: user.role_id,
            username: user.username,
        };

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            token,
            user: payload
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Couldn't log in right now. Please try again." });
    }
}
