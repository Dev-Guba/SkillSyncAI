import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class LearningResource(BaseModel):
    title: str
    source: str
    url: str


class SkillLearningRecommendation(BaseModel):
    skill: str
    description: str
    fundamentals: list[str]
    where_to_learn: list[LearningResource]
    practice: str


class LearningRecommendationResponse(BaseModel):
    recommendations: list[SkillLearningRecommendation]


def generate_learning_recommendations(
    job_title,
    missing_skills
):

    if not missing_skills:
        return {
            "recommendations": []
        }

    prompt = f"""
You are the learning recommendation assistant for SkillSyncAI.

Target Job:
{job_title}

Missing Skills:
{", ".join(missing_skills)}

For every missing skill, provide:

1. skill
2. description
3. fundamentals
4. where_to_learn
5. practice

Description:
Briefly explain what the skill is and why it is relevant
to the target job.

Fundamentals:
List the essential concepts a learner should understand first.

Where to Learn:
Recommend reputable resources.
Prefer official documentation, recognized learning platforms,
universities, and established technical organizations.

Practice:
Give a practical project or exercise that allows the learner
to apply the skill.

Keep the recommendations practical and appropriate for someone
preparing for a professional IT role.
"""

    response = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": LearningRecommendationResponse.model_json_schema()
        }
    )

    result = LearningRecommendationResponse.model_validate_json(
        response.output_text
    )

    return result.model_dump()