def parse_job(job):

    return {
        "external_job_id": job.get("id"),

        "title": job.get("title"),

        "company": job.get("company", {})
                    .get("display_name"),

        "location": job.get("location", {})
                      .get("display_name"),

        "classification": None,

        "subclassification": None,

        "description": job.get("description"),

        "salary": job.get("salary_min"),

        "employment_type": None,

        "source": "Adzuna",

        "posted_date": job.get("created"),

        "url": job.get("redirect_url")
    }



def parse_jobstreet_jobs(data):

    jobs = []

    for job in data.get("jobs", []):

        location = None

        if job.get("locations"):
            location = job["locations"][0].get("label")


        classification = None
        subclassification = None

        if job.get("classifications"):

            classification_data = job["classifications"][0]

            classification = (
                classification_data
                .get("classification", {})
                .get("description")
            )

            subclassification = (
                classification_data
                .get("subclassification", {})
                .get("description")
            )


        jobs.append({

            "external_job_id": job.get("id"),

            "title": job.get("title"),

            "company": job.get("companyName"),

            "location": location,

            "classification": classification,

            "subclassification": subclassification,

            "description": job.get("teaser"),

            "salary": job.get("salaryLabel"),

            "employment_type": (
                job.get("workTypes", [None])[0]
            ),

            "source": "JobStreet",

            "posted_date": job.get("listingDate"),

            "url": None
        })


    return jobs