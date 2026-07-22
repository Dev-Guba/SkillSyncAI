from fastapi import FastAPI
from skill_matching.matcher import calculate_skill_gap
from recommendation.generator import generate_recommendation


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