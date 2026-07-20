import { getAllSkillSets } from "../services/SkillSetServices.js";

export const getSkillSets = async (req, res) => {
  try {
    const skillSets = await getAllSkillSets();
    res.status(200).json({ 
        success: true,
        message: "Skill sets retrieved successfully", 
        skillSets 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    }
}