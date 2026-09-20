import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PARSE_API_KEY")

BASE_URL = "https://api.parse.bot/scraper/7ba73304-777e-4b3d-bb9f-2122d5b0495c"


def fetch_jobstreet_jobs(
    keywords="",
    location="Cebu",
    limit=50
):

    url = f"{BASE_URL}/search_jobs"

    headers = {
        "X-API-Key": API_KEY,
        "API-Snapshot-Version": "8"
    }

    all_jobs = []

    # Parse.bot returns a maximum of 20 jobs per page
    page_size = 20

    # Calculate how many pages we need
    pages_needed = (limit + page_size - 1) // page_size

    for page in range(1, pages_needed + 1):

        params = {
            "keywords": keywords,
            "location": location,
            "limit": page_size,
            "page": page
        }

        print("\n==============================")
        print("FETCHING PAGE:", page)
        print("REQUESTED PAGE SIZE:", page_size)
        print("==============================")

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=60
        )

        print("STATUS:", response.status_code)

        if response.status_code != 200:
            print("ERROR:", response.text)

            return {
                "error": response.text,
                "status_code": response.status_code
            }

        data = response.json()

        page_jobs = data.get("data", {}).get("jobs", [])

        total_count = data.get("data", {}).get(
            "totalCount",
            0
        )

        print("PAGE JOB COUNT:", len(page_jobs))
        print("TOTAL AVAILABLE:", total_count)

        all_jobs.extend(page_jobs)

        # Stop if this page returned fewer than 20
        if len(page_jobs) < page_size:
            break

        # Stop once we have enough jobs
        if len(all_jobs) >= limit:
            break

    # ==========================================
    # REMOVE DUPLICATE JOBS
    # ==========================================

    unique_jobs = []
    seen_ids = set()

    for job in all_jobs:

        # Use JobStreet ID
        # Tracking ID is used as fallback
        job_id = job.get("id") or job.get("tracking")

        if job_id is not None:

            if job_id in seen_ids:
                continue

            seen_ids.add(job_id)

        unique_jobs.append(job)

    # Make sure we don't return more than requested
    all_jobs = unique_jobs[:limit]

    print("\n==============================")
    print("FINAL JOB COUNT:", len(all_jobs))
    print("==============================")

    return {
        "success": True,
        "data": {
            "jobs": all_jobs,
            "totalCount": total_count
        }
    }


if __name__ == "__main__":

    jobs = fetch_jobstreet_jobs(
        keywords="",
        location="Cebu",
        limit=50
    )

    results = jobs.get(
        "data",
        {}
    ).get(
        "jobs",
        []
    )

    print("FINAL RESULT COUNT:", len(results))