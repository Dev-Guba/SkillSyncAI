import express from "express";
import Role from "../../model/Role.js";
import createToken from "../../utils/createToken.js";
import User from "../../model/User.js";
import bcrypt from "bcrypt";

export async function login(req, res) {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
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
}
