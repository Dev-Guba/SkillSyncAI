import UserInterest from "../model/UserInterest.js";

export async function addUserInterest(userId, interestId) {
  const existing = await UserInterest.findOne({
    where: { userId, interestId },
  });

  if (existing) {
    throw new Error("Interest already exists");
  }

  return await UserInterest.create({
    userId,
    interestId,
  });
}

const SKILL_TO_INTEREST = {
  "JavaScript": ["Web Development", "Frontend Development"],
  "React": ["Frontend Development", "UI/UX Design"],
  "Node.js": ["Backend Development"],
  "Python": ["Data Science", "Machine Learning"],
  "Figma": ["UI/UX Design"],
  "AWS": ["Cloud Computing"],
};

export function suggestInterestsFromSkills(skills) {
    let suggestions = [];

    for (const skill of skills) {
        const mapped = SKILL_TO_INTEREST[skill.skill_name] || [];
        suggestions.push(...mapped);
    }

    return [...new Set(suggestions)];
}