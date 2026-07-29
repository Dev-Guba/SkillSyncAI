import pandas as pd
import mysql.connector
from dotenv import load_dotenv
import os


load_dotenv()


DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


def import_jobs():

    file = "dataset/cebu_jobs.xlsx"

    df = pd.read_excel(file)


    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


    cursor = connection.cursor()


    inserted = 0
    skipped = 0


    for _, job in df.iterrows():

        cursor.execute(
            """
            SELECT job_id 
            FROM Jobs
            WHERE external_job_id = %s
            """,
            (
                job["external_job_id"],
            )
        )


        exists = cursor.fetchone()


        if exists:
            skipped += 1
            continue


        cursor.execute(
            """
            INSERT INTO Jobs
            (
                external_job_id,
                title,
                company,
                location,
                classification,
                subclassification,
                description,
                salary,
                employment_type,
                source,
                posted_date,
                url,
                createdAt,
                updatedAt
            )

            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,
                NOW(),NOW()
            )
            """,
            (
                job["external_job_id"],
                job["title"],
                job["company"],
                job["location"],
                job.get("classification"),
                job.get("subclassification"),
                job["description"],
                job.get("salary"),
                job.get("employment_type"),
                job["source"],
                job["posted_date"],
                job.get("url")
            )
        )


        inserted += 1


    connection.commit()

    cursor.close()
    connection.close()


    return {
        "inserted": inserted,
        "skipped": skipped
    }