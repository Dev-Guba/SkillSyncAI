def calculate_skill_gap(user_skills, required_skills):

    user_skills = set(
        skill.lower() for skill in user_skills
    )

    required_skills = set(
        skill.lower() for skill in required_skills
    )


    matched = user_skills.intersection(required_skills)

    missing = required_skills.difference(user_skills)


    score = (
        len(matched) / len(required_skills)
    ) * 100


    return {
        "match_percentage": round(score, 2),
        "matched_skills": list(matched),
        "missing_skills": list(missing)
    }