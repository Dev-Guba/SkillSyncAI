from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_cosine_similarity(user_skills, required_skills):

    user_text = " ".join(
        skill.lower() for skill in user_skills
    )

    required_text = " ".join(
        skill.lower() for skill in required_skills
    )

    # Combine both texts so TF-IDF uses the same vocabulary
    documents = [
        user_text,
        required_text
    ]

    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    return round(float(similarity), 4)


def calculate_skill_gap(user_skills, required_skills):

    user_skills = set(
        skill.lower().strip()
        for skill in user_skills
    )

    required_skills = set(
        skill.lower().strip()
        for skill in required_skills
    )

    matched = user_skills.intersection(
        required_skills
    )

    missing = required_skills.difference(
        user_skills
    )

    # Prevent division by zero
    if len(required_skills) == 0:
        score = 0
    else:
        score = (
            len(matched) / len(required_skills)
        ) * 100

    cosine_score = calculate_cosine_similarity(
        user_skills,
        required_skills
    )

    return {
        "match_percentage": round(score, 2),
        "matched_skills": sorted(list(matched)),
        "missing_skills": sorted(list(missing)),
        "cosine_similarity": cosine_score
    }


def recommend_careers(user_skills, careers):

    recommendations = []

    for career in careers:

        result = calculate_skill_gap(
            user_skills,
            career["required_skills"]
        )

        recommendations.append({
            "job_title_id": career["job_title_id"],
            "job_title_name": career["job_title_name"],
            **result
        })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return recommendations