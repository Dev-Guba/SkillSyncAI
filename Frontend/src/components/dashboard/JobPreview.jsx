import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import API from "../../api/api.js";

export default function JobPreview() {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const userResponse = await API.getMe();
        const user = userResponse.data?.user;
        const jobTitles = user?.JobTitles || [];

        if (jobTitles.length === 0) return;

        const userJobTitle = jobTitles[0];
        const response = await API.getJobsByJobTitle(userJobTitle.job_title_id);

        if (isMounted) {
          setJobTitle(userJobTitle);
          setJobs(response.data?.data?.jobs || []);
        }
      } catch (error) {
        console.error("Failed to load job preview:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Briefcase className="text-primary" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Job Matches</h2>
            <p className="text-sm text-muted">
              {jobTitle
                ? `Opportunities for ${jobTitle.job_title_name}`
                : "Opportunities based on your skills"}
            </p>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted">No matching jobs found.</p>
        ) : (
          jobs.slice(0, 3).map((job, index) => (
            <div
              key={job.external_job_id || job.id || index}
              className="rounded-2xl border border-border p-4 transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{job.title}</h3>
                  <p className="text-sm text-muted">
                    {job.company || "Company not specified"}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[job.location, job.employment_type].filter(Boolean).map((detail) => (
                  <span
                    key={detail}
                    className="flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-xs text-muted"
                  >
                    <CheckCircle2 size={12} className="text-primary" />
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <Link
        to="/dashboard/jobs"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Browse all jobs
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}