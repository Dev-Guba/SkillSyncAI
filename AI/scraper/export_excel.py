import pandas as pd
import os


def export_jobs_to_excel(jobs):

    print("Received jobs:", len(jobs))

    df = pd.DataFrame(jobs)

    print(df.head())

    path = os.path.abspath("dataset/cebu_jobs.xlsx")

    print("Saving to:", path)

    df.to_excel(
        path,
        index=False
    )

    print("Excel created!")

    return path