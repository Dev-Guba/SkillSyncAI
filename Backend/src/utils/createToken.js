import jwt from "jsonwebtoken";

export default function createToken(user) {
    const payload = {
        user_id: user.user_id,
        role_id: user.role_id,
        username: user.username,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}