from fastapi import FastAPI, Query
from pydantic import BaseModel

from skill_matching.matcher import calculate_skill_gap, curriculum_market_similarity
from recommendation.generator import generate_recommendation

# Intenational
from scraper.adzuna_client import fetch_jobs
from scraper.job_parser import parse_job

# Cebu
from scraper.jobstreet_client import fetch_jobstreet_jobs
from scraper.job_parser import parse_jobstreet_jobs

# EXCEL FILE
from scraper.export_excel import export_jobs_to_excel

# Skills AI Recommendation Engine
from skill_matching.matcher import recommend_careers

# Missing Skills Learning Recommendation
from recommendation.learning_recommendation import (
    generate_learning_recommendations
)

# Cleaning and extracting skills from job descriptions
from skill_matching.skill_extractor import extract_skills

# Trend Forecasting
from trend_model.forecaster import forecast_skill_demand

# Emerging skills: skill-like terms in job postings that aren't in the catalog
from skill_matching.skill_discovery import discover_candidate_skills

app = FastAPI()

class Career(BaseModel):
    job_title_id: int
    job_title_name: str
    required_skills: list[str]

class CareerRecommendationRequest(BaseModel):
    user_skills: list[str]
    careers: list[Career]

class LearningRecommendationRequest(BaseModel):
    job_title: str
    missing_skills: list[str]

class BatchSkillExtractionRequest(BaseModel):
    jobs: list[dict]
    skill_dictionary: list[str]

class SkillForecastRequest(BaseModel):
    history: list[dict]
    periods: int = 36

class CurriculumSimilarityRequest(BaseModel):
    program_skills: list[str]
    # {skill name: number of postings mentioning it}
    market_demand: dict[str, int]

class SkillDiscoveryRequest(BaseModel):
    # [{"id": job_id, "company": "...", "description": "..."}]
    jobs: list[dict]
    skill_dictionary: list[str]
    min_jobs: int = 2
    min_companies: int = 2
    limit: int = 100


@app.get("/")
def home():
    return {
        "message": "SkillSyncAI Engine Running"
    }


@app.post("/analyze")
def analyze(data: dict):

    user_skills = data["user_skills"]
    required_skills = data["required_skills"]

    result = calculate_skill_gap(
        user_skills,
        required_skills
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
def cebu_jobs(
    keywords: str = Query(""),
    location: str = Query("Cebu"),
    limit: int = Query(50)
):

    raw_jobs = fetch_jobstreet_jobs(
        keywords=keywords,
        location=location,
        limit=limit
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

@app.post("/recommend-careers")
def recommend_career_paths(
    data: CareerRecommendationRequest
):

    careers = [
        career.model_dump()
        for career in data.careers
    ]

    result = recommend_careers(
        data.user_skills,
        careers
    )

    return {
        "success": True,
        "data": result
    }

@app.post("/learning-recommendations")
def recommend_learning(
    request: LearningRecommendationRequest
):
    try:
        result = generate_learning_recommendations(
            request.job_title,
            request.missing_skills
        )

        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.post("/curriculum-similarity")
def curriculum_similarity(request: CurriculumSimilarityRequest):
    return {
        "success": True,
        "cosine_similarity": curriculum_market_similarity(
            request.program_skills,
            request.market_demand,
        ),
    }

@app.post("/discover-skills")
def discover_skills(request: SkillDiscoveryRequest):
    candidates = discover_candidate_skills(
        request.jobs,
        request.skill_dictionary,
        min_jobs=request.min_jobs,
        min_companies=request.min_companies,
        limit=request.limit,
    )

    return {
        "success": True,
        "count": len(candidates),
        "candidates": candidates,
    }

@app.post("/extract-job-skills")
def extract_job_skills(
    request: BatchSkillExtractionRequest
):
    processed_jobs = []

    for job in request.jobs:

        # Titles often name the skill ("Flutter Developer"), and JobStreet
        # descriptions are only short teasers, so read both.
        text = f"{job.get('title') or ''}. {job.get('description') or ''}"

        skills = extract_skills(
            text,
            request.skill_dictionary
        )

        processed_jobs.append({
            **job,
            "skills": skills
        })

    return {
        "success": True,
        "jobs": processed_jobs
    }

@app.post("/forecast-skill")
def forecast_skill(request: SkillForecastRequest):

    predictions = forecast_skill_demand(
        request.history,
        request.periods
    )

    return {
        "success": True,
        "forecast": predictions
    }