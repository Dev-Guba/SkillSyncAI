from skill_matching.skill_extractor import extract_skills


def process_jobs(jobs, skill_dictionary):
    processed_jobs = []

    for job in jobs:

        description = job.get("description", "")

        skills = extract_skills(
            description,
            skill_dictionary
        )

        processed_job = {
            **job,
            "skills": skills
        }

        processed_jobs.append(
            processed_job
        )

    return processed_jobs