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


# ---------------------------------------------------------------------------
# Skills whose names are also everyday words or single letters. Matching them
# like any other skill produced false hits ("C" in "C-level", "go" in "go
# above", "teams" in "work with teams", "from scratch"...). These only count
# when the text shows they mean the skill. Patterns run on the ORIGINAL text,
# case-sensitive unless they use (?i).
# ---------------------------------------------------------------------------
_SEP = r"\s*(?:/|,|and|or|&)\s*"

CONTEXT_RULES = {
    "c": re.compile(
        r"\bC" + _SEP + r"C\+\+|C\+\+" + _SEP + r"C\b|\bC (?:programming|language)\b|\b[Ee]mbedded C\b"
    ),
    "r": re.compile(
        r"\bR (?:programming|language|Studio)\b|\bRStudio\b"
        r"|\b(?:Python|SQL|SAS|SPSS|Stata)" + _SEP + r"R\b"
        r"|\bR" + _SEP + r"(?:Python|SQL|SAS|SPSS|Stata)\b"
    ),
    "go": re.compile(
        r"\bGolang\b|\bGo (?:language|lang|programming)\b"
        r"|\b(?:Python|Java|Rust|Node\.?js|C\+\+|PHP)" + _SEP + r"Go\b"
        r"|\bGo" + _SEP + r"(?:Python|Java|Rust|Node|C\+\+|PHP)\b"
    ),
    "teams": re.compile(r"(?i)\b(?:MS|Microsoft)\s+Teams\b"),
    "access": re.compile(r"(?i)\b(?:MS|Microsoft)\s+Access\b"),
    "word": re.compile(
        r"(?i)\b(?:MS|Microsoft)\s+Word\b|\bWord" + _SEP + r"Excel\b|\bExcel" + _SEP + r"Word\b"
    ),
    "excel": re.compile(r"(?i:\b(?:MS|Microsoft)\s+Excel\b)|\bExcel\b(?!\s+(?:in|at|as)\b)"),
    "spring": re.compile(r"\bSpring\s*(?:Boot|Framework|MVC|Cloud|Security|Data)\b"),
    "scratch": re.compile(r"(?<!from )\bScratch\b"),
    "swift": re.compile(r"\bSwift(?:UI)?\b(?!\s+(?:response|action|turnaround|delivery|resolution))"),
    "unity": re.compile(r"\bUnity(?:3D)?\b"),
    "sketch": re.compile(r"\bSketch\b"),
    "rust": re.compile(r"\bRust\b"),
    "java": re.compile(r"\bJava\b(?!\s*Script)|\bJAVA\b"),
}


def _is_acronym(skill):
    """'SQL', 'AWS', 'HL7', 'C#' -> match only in capitals ('gis', 'pos' are words)."""
    letters = re.sub(r"[^A-Za-z]", "", skill)
    return 1 < len(letters) <= 5 and letters.isupper()


def extract_skills(description, skill_dictionary):
    """
    Extract known skills from a job description (pass title + description).

    description:
        Job text.

    skill_dictionary:
        List of known skills.
    """

    original = description or ""
    text = normalize_text(original)

    found_skills = []

    for skill in skill_dictionary:

        normalized_skill = normalize_text(skill)

        if not normalized_skill:
            continue

        # Ambiguous names: need context
        rule = CONTEXT_RULES.get(normalized_skill)
        if rule is not None:
            if rule.search(original):
                found_skills.append(normalized_skill)
            continue

        # Acronyms: exact capitals in the original text
        if _is_acronym(skill.strip()):
            pattern = r"(?<![\w])" + re.escape(skill.strip()) + r"(?![\w#+])"
            if re.search(pattern, original):
                found_skills.append(normalized_skill)
            continue

        # Everything else: case-insensitive whole-word match
        pattern = r"(?<!\w)" + re.escape(
            normalized_skill
        ) + r"(?!\w)"

        if re.search(pattern, text):
            found_skills.append(
                normalized_skill
            )

    return sorted(set(found_skills))
