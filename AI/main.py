from fastapi import FastAPI
from skill_matching.matcher import calculate_skill_gap
from recommendation.generator import generate_recommendation

# Intenational
from scraper.adzuna_client import fetch_jobs
from scraper.job_parser import parse_job

# Cebu
from scraper.jobstreet_client import fetch_jobstreet_jobs
from scraper.job_parser import parse_jobstreet_jobs

# EXCEL FILE
from scraper.export_excel import export_jobs_to_excel


app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "SkillSyncAI Engine Running"
    }


@app.post("/analyze")
def analyze(data: dict):

    result = calculate_skill_gap(
        data["user_skills"],
        data["required_skills"]
    )

    return result


@app.post("/recommend")
def recommend(data: dict):

    result = generate_recommendation(
        data.get("missing_skills", [])
    )

    return result

@app.get("/jobs")
def jobs():

    data = fetch_jobs(
        "software developer",
        "Singapore"
    )


    clean_jobs = []

    for job in data["results"]:
        clean_jobs.append(
            parse_job(job)
        )


    return {
        "count": len(clean_jobs),
        "jobs": clean_jobs
    }

@app.get("/cebu-jobs")
def cebu_jobs():

    raw_jobs = fetch_jobstreet_jobs(
        keywords="",
        location="Cebu",
        limit=50
    )


    clean_jobs = parse_jobstreet_jobs(
        raw_jobs.get("data", {})
    )


    return {
        "success": True,
        "count": len(clean_jobs),
        "jobs": clean_jobs
    }

@app.get("/export-jobs")
def export_jobs():

    raw_jobs = fetch_jobstreet_jobs(
        keywords="",
        location="Cebu",
        limit=50
    )

    jobs = parse_jobstreet_jobs(
        raw_jobs.get("data", {})
    )


    file = export_jobs_to_excel(jobs)


    return {
        "success": True,
        "message": "Jobs exported",
        "file": file,
        "count": len(jobs)
    }