import { UserSkill, SkillSet } from "../model/relation.js";

export async function createUserSkills(user_id, skills) {
    try {
        const userSkills = skills.map(skill => ({
            user_id,
            skill_set_id: skill.skill_set_id,
            proficiency_level: skill.proficiency_level,
        }));

        return await UserSkill.bulkCreate(userSkills);
    } catch (error) {
        console.error("Error creating user skills:", error);
        throw error;
    }
}