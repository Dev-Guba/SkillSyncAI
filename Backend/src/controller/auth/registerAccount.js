import express from "express";
import { User, UserProfile, UserSkills } from "../models/index.js";
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
    } catch (error) {
        console.error("Error registering account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}