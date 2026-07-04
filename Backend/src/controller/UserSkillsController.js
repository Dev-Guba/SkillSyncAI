import { createUserSkills } from "../services/UserSkillsServices.js";

export const handleUserSkills = async (req, res) => {
    const user_id = req.user.user_id;
    const  { skills }  = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
            success: false,
            message: "skills must be a non-empty array",
        });
    }

    try {
        const userSkills = await createUserSkills(user_id, skills);

        res.status(201).json({
            success: true,
            message: "User skills created successfully",
            userSkills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};