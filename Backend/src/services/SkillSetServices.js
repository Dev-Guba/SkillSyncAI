import SkillSet from "../model/SkillSet.js";

// GET ALL SKILLS
export async function getAllSkillSets() {
    try {
        return await SkillSet.findAll({
            order: [["skill_set_name", "ASC"]]
        });
    } catch (error) {
        console.error("Error fetching skill sets:", error);
        throw error;
    }
}

// CREATE SKILL
export async function createSkillSet(skill_set_name) {
    try {
        return await SkillSet.create({
            skill_set_name
        });
    } catch (error) {
        console.error("Error creating skill:", error);
        throw error;
    }
}

// RENAME SKILL
export async function renameSkillSet(skill_set_id, skill_set_name) {
    try {
        const skill = await SkillSet.findByPk(skill_set_id);

        if (!skill) {
            return null;
        }

        await skill.update({
            skill_set_name
        });

        return skill;
    } catch (error) {
        console.error("Error renaming skill:", error);
        throw error;
    }
}