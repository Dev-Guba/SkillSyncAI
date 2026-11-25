from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _normalize_skill(skill):
    # lowercase and collapse spaces: "  Machine   Learning " -> "machine learning"
    return " ".join(str(skill).lower().split())


def calculate_cosine_similarity(user_skills, required_skills):
    """
    TF-IDF + cosine similarity between a student's skills and a career's
    required skills.

    Each skill is ONE term ("machine learning" stays whole). Previously the
    skills were joined into a sentence and split into single words, so
    "Deep Learning" and "Machine Learning" looked 34% similar just because
    both contain "learning" (same for "Project/Product Management",
    "Data Analysis/Visualization").
    """
    user_terms = sorted({_normalize_skill(s) for s in user_skills if _normalize_skill(s)})
    required_terms = sorted({_normalize_skill(s) for s in required_skills if _normalize_skill(s)})

    # TF-IDF can't build a vocabulary from nothing
    if not user_terms or not required_terms:
        return 0.0

    # Both lists in one fit so TF-IDF uses the same vocabulary.
    # analyzer=identity: each list item is already one term.
    documents = [user_terms, required_terms]

    vectorizer = TfidfVectorizer(analyzer=lambda terms: terms)

    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    return round(float(similarity), 4)


def curriculum_market_similarity(program_skills, market_demand):
    """
    TF-IDF + cosine similarity between a program's curriculum and the job
    market for its careers (Objective 2.2, curriculum alignment).

    program_skills: skills the program teaches (each counted once)
    market_demand:  {skill: number of postings mentioning it}

    Documents (each skill is one term):
      curriculum = every taught skill once
      market     = each in-demand skill repeated by its posting count, so
                   skills employers ask for more weigh more (term frequency)
    Returns a value from 0 (no overlap) to 1 (same skills in the same
    proportions), or 0.0 when either side is empty.
    """
    curriculum = sorted({_normalize_skill(s) for s in program_skills if _normalize_skill(s)})

    market = []
    for skill, count in (market_demand or {}).items():
        term = _normalize_skill(skill)
        if term and int(count) > 0:
            market.extend([term] * int(count))

    if not curriculum or not market:
        return 0.0

    vectorizer = TfidfVectorizer(analyzer=lambda terms: terms)
    matrix = vectorizer.fit_transform([curriculum, market])

    return round(float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0]), 4)


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