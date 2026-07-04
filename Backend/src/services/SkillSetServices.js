import SkillSet from "../model/SkillSet.js";

export async function getAllSkillSets() {
    try {
        const skillSets = await SkillSet.findAll();
        return skillSets;
    } catch (error) {
        console.error("Error fetching skill sets:", error);
        throw error;
    }
}