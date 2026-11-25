// Use after verifyToken. Role 1 is the admin role (see the users seeder).
const ADMIN_ROLE_ID = 1;

export function requireAdmin(req, res, next) {
    if (Number(req.user?.role_id) !== ADMIN_ROLE_ID) {
        return res.status(403).json({ message: "Admins only." });
    }
    next();
}
