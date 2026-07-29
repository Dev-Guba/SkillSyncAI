from dotenv import load_dotenv
import os
import requests


load_dotenv()


APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")


BASE_URL = "https://api.adzuna.com/v1/api/jobs"


def fetch_jobs(
    keyword,
    location,
    country="sg",
    page=1,
    results_per_page=50
):

    url = f"{BASE_URL}/{country}/search/{page}"


    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": keyword,
        "where": location,
        "results_per_page": results_per_page,
    }


    response = requests.get(
        url,
        params=params
    )


    if response.status_code != 200:
        raise Exception(
            f"Adzuna API Error: {response.text}"
        )


    return response.json()