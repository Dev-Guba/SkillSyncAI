import express from "express";
import bcrypt from "bcrypt";
import createToken from "../../utils/createToken.js";
import { User, UserProfile, UserSkill } from "../../model/relation.js";
import { Op } from "sequelize";

export async function registerAccount(req, res) {
    try {
        const {username, password, role_id } = req.body;

        // Validate input fields
        if (!username || !password || !role_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Register new user
        const newUser = await User.create({ username, password: passwordHash, role_id });

        const token = createToken(newUser);
        res.status(201).json({ 
            success: true,
            message: "Account registered successfully", 
            user: newUser,
            token 
        });

    } catch (error) {
        console.error("Error registering account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}