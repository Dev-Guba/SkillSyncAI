import crypto from "node:crypto";
import { verifyToken } from "./verifyToken.js";
import { requireAdmin } from "./requireAdmin.js";

/*
| Lets a scheduler call an endpoint with the shared secret
| (header "X-Cron-Secret: <CRON_SECRET>"), and otherwise requires a logged-in
| admin. Without CRON_SECRET set, only admins can call it.
*/
export function requireAdminOrCron(req, res, next) {
    const secret = process.env.CRON_SECRET;
    const given = req.headers["x-cron-secret"];

    if (secret && typeof given === "string") {
        const a = Buffer.from(given);
        const b = Buffer.from(secret);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
            req.user = { user_id: null, username: "scheduler", role_id: null };
            return next();
        }
        return res.status(403).json({ message: "Invalid scheduler secret." });
    }

    return verifyToken(req, res, () => requireAdmin(req, res, next));
}
