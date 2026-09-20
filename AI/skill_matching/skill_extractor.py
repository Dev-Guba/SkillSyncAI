import re


def normalize_text(text):
    if not text:
        return ""

    text = text.lower()

    # Replace special characters with spaces
    text = re.sub(r"[^a-z0-9+#.\-/ ]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def extract_skills(description, skill_dictionary):
    """
    Extract known skills from a job description.

    description:
        Job description text.

    skill_dictionary:
        List of known skills.
    """

    text = normalize_text(description)

    found_skills = []

    for skill in skill_dictionary:

        normalized_skill = normalize_text(skill)

        if not normalized_skill:
            continue

        # Escape special regex characters
        pattern = r"(?<!\w)" + re.escape(
            normalized_skill
        ) + r"(?!\w)"

        if re.search(pattern, text):
            found_skills.append(
                normalized_skill
            )

    return sorted(set(found_skills))