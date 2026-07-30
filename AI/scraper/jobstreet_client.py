import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PARSE_API_KEY")

BASE_URL = "https://api.parse.bot/scraper/7ba73304-777e-4b3d-bb9f-2122d5b0495c"


def fetch_jobstreet_jobs(
    keywords="",
    location="Cebu",
    limit=10
):

    url = f"{BASE_URL}/search_jobs"

    headers = {
        "X-API-Key": API_KEY,
        "API-Snapshot-Version": "8"
    }

    params = {
        "keywords": keywords,
        "location": location,
        "limit": limit
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    if response.status_code != 200:
        return {
            "error": response.text,
            "status_code": response.status_code
        }

    return response.json()