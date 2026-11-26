"""
Emerging-skill discovery (Objectives 2.1 and 2.3).

extract_skills() only finds skills that are already in the catalog, so a new
skill appearing in job postings would never be noticed or forecast. This
module scans job descriptions for skill-like terms that are NOT in the
catalog and counts how many distinct job postings mention each one. Terms
seen in enough postings are returned as candidates for an admin to review.

A term is a candidate when it is either
  1. an item in a skills list, e.g. "experience with Kubernetes, Terraform
     and Jenkins" or "knowledge of Power BI", or
  2. tech-styled: mixed case (TypeScript), contains . # + (Next.js, C#),
     letters with digits (S3), or a short all-caps acronym (GCP).
Generic words ("team", "degree", "years"...) and existing skills are
filtered out. Terms that look like a variant of an existing skill
("ReactJS" vs "React") are flagged with similar_to so they can be merged.
"""

import re
from collections import defaultdict

# Phrases that usually introduce a list of skills
CUE_PATTERN = re.compile(
    r"\b(?:experience (?:with|in|using)|knowledge (?:of|in)|proficien(?:t|cy) (?:in|with)"
    r"|familiar(?:ity)? with|skilled in|expertise in|hands-on (?:experience )?(?:with|in)"
    r"|working knowledge of|understanding of|exposure to|background in"
    r"|such as|including|e\.g\.)\s+(.{3,200}?)(?:[.;:!?\n]|$)",
    re.IGNORECASE,
)

LIST_SPLIT = re.compile(r"\s*(?:,|/|;|\band\b|\bor\b|&|\(|\))\s*", re.IGNORECASE)

TECH_TOKEN = re.compile(
    r"(?<![\w.#+])("
    r"[A-Za-z][A-Za-z0-9]*[.#+][A-Za-z0-9.#+]*"       # Next.js, C#, C++, ASP.NET
    r"|[A-Z][a-z]+[A-Z][A-Za-z0-9]*"                   # TypeScript, PowerShell
    r"|[A-Za-z]+[0-9][A-Za-z0-9]*"                     # S3, ES6, Web3
    r"|[A-Z]{2,6}"                                     # GCP, ERP
    r")(?![\w#+])"
)

# Words/phrases that show up in job ads but are not skills
GENERIC = {
    # words
    "a", "an", "the", "and", "or", "of", "in", "on", "with", "for", "to", "at", "by",
    "our", "your", "their", "we", "you", "is", "are", "be", "as", "all", "other", "etc",
    "related", "relevant", "similar", "various", "different", "new", "latest", "modern",
    "basic", "advanced", "strong", "good", "excellent", "solid", "proven", "minimum",
    "least", "plus", "preferred", "required", "must", "ability", "skills", "skill",
    "knowledge", "experience", "experiences", "years", "year", "months", "degree",
    "graduate", "bachelor", "bachelors", "college", "course", "field", "work", "working",
    "team", "teams", "client", "clients", "customer", "customers", "company", "business",
    "office", "role", "position", "job", "candidate", "applicant", "applicants", "tools",
    "tool", "technologies", "technology", "systems", "system", "software", "platforms",
    "platform", "environment", "industry", "projects", "project", "management", "support",
    "processes", "process", "development", "applications", "application", "services",
    "service", "solutions", "solution", "products", "product", "data", "time", "people",
    "areas", "area", "tasks", "task", "duties", "responsibilities", "others",
    # job-ad acronyms / places / admin terms
    "it", "hr", "bs", "ba", "ab", "ms", "ma", "phd", "ojt", "ph", "usa", "us", "uk", "ncr",
    "cebu", "manila", "mandaue", "lapu", "am", "pm", "eod", "wfh", "rto", "sss", "tin",
    "nbi", "hmo", "pag", "ibig", "philhealth", "ceo", "cto", "cfo", "vp", "ot", "dole",
    "pwd", "id", "ids", "faq", "asap", "ie", "eg", "ok", "na", "tba", "tbd", "bpo",
    "full", "part", "time", "shift", "night", "day", "salary", "php", "usd",
    # job titles (the posting's role, not a skill)
    "engineer", "engineers", "developer", "developers", "specialist", "manager",
    "analyst", "assistant", "officer", "accountant", "staff", "intern", "interns",
    "associate", "lead", "supervisor", "representative", "agent", "coordinator",
    "consultant", "technician", "administrator", "designer", "programmer", "head",
    # perks / HR
    "pto", "benefits", "bonus", "bonuses", "allowance", "incentives", "leave", "leaves",
    "insurance", "training", "career", "growth", "opportunities", "opportunity",
    # shouted ad words
    "apply", "now", "above", "urgent", "hiring", "join", "us", "inc", "corp", "ltd",
    "this", "that", "these", "those", "list", "below", "here", "today",
    # vague nouns that pass the "skills list" test
    "standards", "standard", "operations", "operation", "equipment", "improvement",
    "quality", "reporting", "reports", "report", "decisions", "delivery", "design",
    "expertise", "frameworks", "framework", "performance", "pipelines", "pipeline",
    "specifications", "documentation", "requirements", "policies", "procedures",
    "guidelines", "best", "practices", "concepts", "principles", "methodologies",
    "techniques", "functions", "features", "issues", "problems", "results", "goals",
}

# Abbreviations whose full name may already be in the catalog. Used only to
# suggest a merge ("AI" ~ "Artificial Intelligence"), never to auto-merge.
ALIASES = {
    "ai": "artificial intelligence",
    "ml": "machine learning",
    "qa": "quality assurance",
    "qc": "quality control",
    "js": "javascript",
    "ts": "typescript",
    "k8s": "kubernetes",
    "ux": "user experience",
    "ui": "user interface",
    "nlp": "natural language processing",
    "seo": "search engine optimization",
    "crm": "customer relationship management",
    "erp": "enterprise resource planning",
    "etl": "extract transform load",
    "cad": "computer-aided design",
    "oop": "object-oriented programming",
    "gcp": "google cloud platform",
    "aws": "amazon web services",
    "ci/cd": "continuous integration",
    "bi": "business intelligence",
}

MAX_WORDS = 4


def _norm(text):
    return " ".join(str(text).lower().split()).strip(" .-")


def _squash(text):
    """'React.js' / 'ReactJS' / 'react js' -> 'react' (for spotting variants)."""
    s = re.sub(r"[^a-z0-9#+]", "", _norm(text))
    return re.sub(r"(js)$", "", s) if len(s) > 4 else s


def _clean_item(item):
    item = item.strip(" -•*·\t\"'")
    item = re.sub(r"^(?:a|an|the|basic|advanced|strong|good|solid|working|hands-on)\s+", "", item, flags=re.I)
    return item.strip(" -•*·\t\"'")


def _is_candidate(term):
    n = _norm(term)
    if len(n) < 2 or len(n) > 40:
        return False
    words = n.split()
    if len(words) > MAX_WORDS:
        return False
    if all(w in GENERIC for w in words):
        return False
    # A single plain lowercase word ("troubleshooting", "quality") is almost
    # always ordinary English in a job ad, not a named skill
    if len(words) == 1 and term == term.lower() and not re.search(r"[0-9.#+]", term):
        return False
    if re.fullmatch(r"[\d\s.+%-]+", n):          # numbers like "3+" or "2-5"
        return False
    if not re.search(r"[a-z]", n):
        return False
    # Long plain-lowercase phrases are usually sentences, not skills
    if len(words) >= 3 and term == term.lower():
        return False
    return True


def _terms_from_description(description):
    text = str(description or "")
    found = set()

    for match in CUE_PATTERN.finditer(text):
        for item in LIST_SPLIT.split(match.group(1)):
            item = _clean_item(item)
            if item and _is_candidate(item):
                found.add(item)

    for match in TECH_TOKEN.finditer(text):
        token = match.group(1).strip(".")
        if _is_candidate(token):
            found.add(token)

    return found


def discover_candidate_skills(jobs, skill_dictionary, min_jobs=2, min_companies=2, limit=100):
    """
    jobs: [{"id": ..., "company": "...", "description": "..."}]
    skill_dictionary: existing skill names
    Returns candidates seen in at least min_jobs postings from at least
    min_companies different companies (one company's internal jargon
    repeated across its own ads isn't a labor-market skill):
      [{"term", "display_name", "job_count", "company_count", "job_ids", "similar_to"}]
    Jobs without a company count as their own company.
    """
    known = {_norm(s) for s in skill_dictionary if _norm(s)}
    known_squashed = {}
    known_by_norm = {}
    for s in skill_dictionary:
        if _norm(s):
            known_squashed.setdefault(_squash(s), s)
            known_by_norm.setdefault(_norm(s), s)

    def similar_skill(term):
        # "ReactJS" ~ "React"
        hit = known_squashed.get(_squash(term))
        if hit:
            return hit
        # "AI" ~ "Artificial Intelligence" (only if that skill exists)
        full = ALIASES.get(term)
        if full:
            for norm_name, original in known_by_norm.items():
                if norm_name == full or norm_name.startswith(full):
                    return original
        return None

    job_ids = defaultdict(set)
    companies = defaultdict(set)
    spellings = defaultdict(lambda: defaultdict(int))  # term -> {original spelling: count}

    for job in jobs:
        jid = job.get("id")
        company = _norm(job.get("company") or "") or f"__job_{jid}"
        for term in _terms_from_description(job.get("description")):
            n = _norm(term)
            if n in known:
                continue
            job_ids[n].add(jid)
            companies[n].add(company)
            spellings[n][term] += 1

    candidates = []
    for n, ids in job_ids.items():
        if len(ids) < min_jobs or len(companies[n]) < min_companies:
            continue
        display = max(spellings[n].items(), key=lambda kv: kv[1])[0]
        similar = similar_skill(n)
        candidates.append({
            "term": n,
            "display_name": display,
            "job_count": len(ids),
            "company_count": len(companies[n]),
            "job_ids": sorted(i for i in ids if i is not None),
            # e.g. "reactjs" -> existing "React": merge instead of adding
            "similar_to": similar,
        })

    candidates.sort(key=lambda c: (-c["job_count"], c["term"]))
    return candidates[:limit]
