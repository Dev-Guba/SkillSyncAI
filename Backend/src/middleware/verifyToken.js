import jwt from "jsonwebtoken";
import User from "../model/User.js";

/*
| Checks the login token, then that the account still exists and is active,
| so a deactivated or deleted user is locked out straight away instead of
| when their token expires (tokens last 1 hour).
|
| The role is also taken from the database, so a promoted/demoted user gets
| the new permissions immediately.
|
| Account lookups are cached briefly to avoid a database query per request;
| admin actions clear the cache for that user (forgetAccountStatus).
*/
const STATUS_CACHE_MS = 30 * 1000;
const statusCache = new Map(); // user_id -> { active, role_id, until }

export function forgetAccountStatus(user_id) {
    statusCache.delete(Number(user_id));
}

async function accountStatus(user_id) {
    const id = Number(user_id);
    const cached = statusCache.get(id);
    if (cached && cached.until > Date.now()) return cached;

    const user = await User.findByPk(id, { attributes: ["is_active", "role_id"] });
    const status = {
        exists: Boolean(user),
        active: Boolean(user?.is_active),
        role_id: user?.role_id ?? null,
        until: Date.now() + STATUS_CACHE_MS,
    };

    statusCache.set(id, status);
    if (statusCache.size > 10000) {
        statusCache.delete(statusCache.keys().next().value);
    }
    return status;
}

export async function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(403).json({ message: "Invalid access token" });
    }

    try {
        const status = await accountStatus(decoded.user_id);

        if (!status.exists) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        if (!status.active) {
            return res.status(403).json({
                message: "Account deactivated",
                code: "ACCOUNT_DEACTIVATED",
            });
        }

        req.user = { ...decoded, role_id: status.role_id };
        next();
    } catch (error) {
        console.error("Account status check failed:", error);
        return res.status(500).json({ message: "Couldn't check your account. Please try again." });
    }
}
