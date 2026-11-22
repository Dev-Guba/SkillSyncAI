import {
    getAllSkillSets,
    createSkillSet,
    renameSkillSet
} from "../services/SkillSetServices.js";

// GET ALL SKILLS
export const getSkillSets = async (req, res) => {
    try {
        const skillSets = await getAllSkillSets();

        return res.status(200).json({
            success: true,
            message: "Skill sets retrieved successfully",
            skillSets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE SKILL
export const createSkill = async (req, res) => {
    try {
        const { skill_set_name } = req.body;

        if (!skill_set_name || !skill_set_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required."
            });
        }

        const skill = await createSkillSet(skill_set_name);

        return res.status(201).json({
            success: true,
            message: "Skill created successfully",
            skill
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RENAME SKILL
export const renameSkill = async (req, res) => {
    try {
        const { skill_set_id } = req.params;
        const { skill_set_name } = req.body;

        if (!skill_set_name || !skill_set_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required."
            });
        }

        const skill = await renameSkillSet(
            skill_set_id,
            skill_set_name
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Skill renamed successfully",
            skill
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};