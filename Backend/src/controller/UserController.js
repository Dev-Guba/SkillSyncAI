import { 
    createUser,
    getSelfUser
 } from "../services/UserServices.js";
import User from "../model/User.js";
import Role from "../model/Role.js";

export async function createUserController(req, res) {
    try {
        const { username, password, role_id } = req.body;

        // Validate input fields
        if (!username || !password || !role_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Succeed
        const now = new Date();
        await createUser(username, password, role_id, now, now);
        res.status(201).json({ 
            success: true,
            message: "User created successfully" 
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMe(req,res){
try{
    const user_id = req.user.user_id;

    const user = await getSelfUser(user_id);

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    return res.json({
            success: true,
            user
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
}