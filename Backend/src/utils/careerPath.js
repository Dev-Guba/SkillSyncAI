const SKILL_GROUPS = {
  frontend: [18, 19, 2, 6],
  backend: [4, 5, 11, 12],
};

export function detectCategories(selectedSkills) {
  const categories = new Set();

  for (const skill of selectedSkills) {
    const id = skill.skill_set_id;

    if (SKILL_GROUPS.frontend.includes(name)) {
      categories.add("frontend");
    }

    if (SKILL_GROUPS.backend.includes(name)) {
      categories.add("backend");
    }
  }

  return categories;
}

export function generateInterests(selectedSkills) {
  const categories = detectCategories(selectedSkills);

  const interests = [];

  const hasFrontend = categories.has("frontend");
  const hasBackend = categories.has("backend");

  if (hasFrontend && hasBackend) {
    interests.push("Fullstack Developer");
    return interests;
  }

  if (hasFrontend) {
    interests.push("Frontend Developer");
  }

  if (hasBackend) {
    interests.push("Backend Developer");
  }

  return interests;
}