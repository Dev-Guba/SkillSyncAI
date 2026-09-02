import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function JobsPage() {

const [jobs, setJobs] = useState([]);
const [jobTitle, setJobTitle] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(() => {

    async function loadJobs() {

        try {

            setLoading(true);
            setError(null);


            // Get current user
            const userResponse =
                await API.getMe();


            const user =
                userResponse.data.data ||
                userResponse.data;


            // Get user's Job Title
            const jobTitles =
                user.JobTitles || [];


            if (jobTitles.length === 0) {

                setError(
                    "You don't have a job title selected yet."
                );

                return;

            }


            const userJobTitle =
                jobTitles[0];


            setJobTitle(
                userJobTitle
            );


            // Get jobs based on Job Title ID
            const jobsResponse =
                await API.getJobsByJobTitle(
                    userJobTitle.job_title_id
                );


            const jobData =
                jobsResponse.data.data;


            setJobs(
                jobData?.jobs || []
            );


        } catch (error) {

            console.error(
                "Failed to load jobs:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load jobs."
            );

        } finally {

            setLoading(false);

        }

    }


    loadJobs();

}, []);


if (loading) {

    return (
        <section className="p-6">

            <h1 className="text-3xl font-bold">
                Jobs
            </h1>

            <p className="mt-4">
                Loading jobs...
            </p>

        </section>
    );

}


if (error) {

    return (
        <section className="p-6">

            <h1 className="text-3xl font-bold">
                Jobs
            </h1>

            <p className="mt-4 text-red-500">
                {error}
            </p>

        </section>
    );

}


return (
    <section className="p-6">

        <div className="mb-6">

            <h1 className="text-3xl font-bold">
                Jobs
            </h1>

            {jobTitle && (
                <p className="mt-2 text-muted">
                    Showing jobs for{" "}
                    <strong>
                        {jobTitle.job_title_name}
                    </strong>
                </p>
            )}

        </div>


        {jobs.length === 0 ? (

            <p className="text-muted">
                No jobs found for this job title.
            </p>

        ) : (

            <div className="grid gap-4">

                {jobs.map((job, index) => (

                    <div
                        key={
                            job.external_job_id ||
                            index
                        }
                        className="rounded-lg border p-5"
                    >

                        <h2 className="text-xl font-semibold">
                            {job.title}
                        </h2>

                        <p className="mt-1">
                            {job.company}
                        </p>

                        <p className="mt-1 text-muted">
                            {job.location}
                        </p>

                        {job.salary && (
                            <p className="mt-2">
                                {job.salary}
                            </p>
                        )}

                        {job.employment_type && (
                            <p className="mt-1 text-muted">
                                {job.employment_type}
                            </p>
                        )}

                    </div>

                ))}

            </div>

        )}

    </section>
);

}