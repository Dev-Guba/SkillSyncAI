import { UserSkill, SkillSet } from "../model/relation.js";

export async function createUserSkills(user_id, skills) {
    try {

        const skillIds = [...new Set(skills.map(skill => skill.skill_set_id))];
        const existingSkills = await SkillSet.findAll({
            where: {
                skill_set_id: skillIds,
            },
        });

        if (existingSkills.length !== skillIds.length) {
            throw new Error("One or more skills do not exist.");
        }

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

export async function updateUserSkills(user_id, skills) {
    try {
        const skillIds = [...new Set(skills.map(skill => skill.skill_set_id))];
        const existingSkills = await SkillSet.findAll({
            where: {
                skill_set_id: skillIds,
            },
        });

        if (existingSkills.length !== skillIds.length) {
            throw new Error("One or more skills do not exist.");
        }

        await UserSkill.destroy({
            where: {
                user_id,
            },
        });

        const userSkills = skills.map(skill => ({
            user_id,
            skill_set_id: skill.skill_set_id,
            proficiency_level: skill.proficiency_level,
        }));

        return await UserSkill.bulkCreate(userSkills);

    } catch (error) {
        console.error("Error updating user skills:", error);
        throw error;
    }
}