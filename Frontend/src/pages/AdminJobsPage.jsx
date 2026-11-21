import { useEffect, useState } from "react";
import {
  Briefcase,
  Download,
  ExternalLink,
  MapPin,
  Building2,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { API } from "@/api/api.js";
import Button from "@/components/common/Button";

const FALLBACK_JOB_TITLES = [
  { job_title_id: 1, job_title_name: "Frontend Developer" },
  { job_title_id: 2, job_title_name: "Backend Developer" },
  { job_title_id: 3, job_title_name: "Full Stack Developer" },
  { job_title_id: 4, job_title_name: "Data Analyst" },
];

export default function AdminJobsPage() {
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", text: string }

  useEffect(() => {
    let active = true;

    async function loadJobTitles() {
      setLoadingTitles(true);
      try {
        const res = await API.getAllJobSkills();
        const data = res.data?.data || res.data || [];
        const finalTitles =
          Array.isArray(data) && data.length > 0 ? data : FALLBACK_JOB_TITLES;
        if (active) {
          setJobTitles(finalTitles);
          setSelectedJobId(String(finalTitles[0].job_title_id));
        }
      } catch {
        if (active) {
          setJobTitles(FALLBACK_JOB_TITLES);
          setSelectedJobId(String(FALLBACK_JOB_TITLES[0].job_title_id));
        }
      } finally {
        if (active) setLoadingTitles(false);
      }
    }

    loadJobTitles();
    return () => {
      active = false;
    };
  }, []);

  const fetchJobsForTitle = async (titleId) => {
    if (!titleId) return;
    setLoadingJobs(true);
    try {
      const res = await API.getJobsByJobTitle(titleId);
      const data = res.data?.data || res.data?.jobs || res.data || [];
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      setFeedback(null);
      fetchJobsForTitle(selectedJobId);
    }
  }, [selectedJobId]);

  const handleImportJobs = async () => {
    if (!selectedJobId) return;
    setImporting(true);
    setFeedback(null);

    try {
      const res = await API.importJobsByJobTitle(selectedJobId);
      const msg =
        res.data?.message || "Jobs imported and refreshed successfully.";
      setFeedback({ type: "success", text: msg });
      await fetchJobsForTitle(selectedJobId);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Could not trigger job import. Make sure the backend job importer is running.",
      });
    } finally {
      setImporting(false);
    }
  };

  const selectedJobObj = jobTitles.find(
    (j) => String(j.job_title_id) === String(selectedJobId)
  );

  const query = search.toLowerCase().trim();
  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || job.job_title || "").toLowerCase();
    const company = (job.company || job.company_name || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    return (
      !query ||
      title.includes(query) ||
      company.includes(query) ||
      location.includes(query)
    );
  });

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Admin • Jobs & Importer
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink">
            Job Listings Manager
          </h1>
          <p className="mt-1 text-sm text-muted">
            Inspect active job postings per career role and trigger fresh imports in one click.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          icon={importing ? Loader2 : Download}
          disabled={importing || !selectedJobId}
          onClick={handleImportJobs}
        >
          {importing ? "Importing Jobs..." : "Import Jobs"}
        </Button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Career Selector */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <Briefcase className="h-4 w-4 text-primary" />
          Select Target Job Title
        </label>

        {loadingTitles ? (
          <p className="text-sm text-muted">Loading job titles...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {jobTitles.map((jt) => {
              const idStr = String(jt.job_title_id);
              const active = selectedJobId === idStr;
              return (
                <button
                  key={idStr}
                  type="button"
                  onClick={() => setSelectedJobId(idStr)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-transparent bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] text-white shadow-xs"
                      : "border-border bg-surface-alt/50 text-ink hover:border-primary"
                  }`}
                >
                  {jt.job_title_name || jt.title || "Job Title"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex h-11 items-center rounded-xl border border-border bg-surface px-4">
        <Search className="mr-3 h-4 w-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search imported jobs by title, company, or location..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      {/* Job Listings */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">
            {selectedJobObj?.job_title_name || "Selected Role"} Postings (
            {filteredJobs.length})
          </h2>
        </div>

        {loadingJobs ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">Fetching job listings...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted">
              No job listings found for this role yet. Click{" "}
              <span className="font-semibold text-ink">Import Jobs</span> above
              to fetch postings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredJobs.map((job, idx) => {
              const title = job.title || job.job_title || "Untitled Position";
              const company =
                job.company || job.company_name || "Company not listed";
              const location = job.location || "Remote / Flexible";
              const url = job.url || job.apply_url || job.redirect_url || null;

              return (
                <div
                  key={job.job_id || job.id || idx}
                  className="flex flex-col justify-between rounded-xl border border-border bg-surface-alt/40 p-4 transition hover:border-primary/40"
                >
                  <div>
                    <h3 className="font-semibold text-ink">{title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {company}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {location}
                      </span>
                    </div>
                  </div>

                  {url && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        View Posting
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}