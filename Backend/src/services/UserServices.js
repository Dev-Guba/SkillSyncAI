import express from "express";
import Role from "../model/Role.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";

export async function createUser(username, password, role_id, created_at, updated_at) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        role_id,
        created_at,
        updated_at
    });
    
    return user;
}