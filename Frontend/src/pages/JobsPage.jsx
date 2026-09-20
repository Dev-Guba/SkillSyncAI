import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import API from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// ======================================================
// HELPERS
// ======================================================

const clean = (text = "") =>
  String(text).replace(/\uFEFF/g, "").trim();

function getJobLink(job) {
  if (/^https?:\/\//i.test(job.url || "")) {
    return job.url;
  }

  if (
    job.source === "JobStreet" &&
    job.external_job_id
  ) {
    return `https://ph.jobstreet.com/job/${job.external_job_id}`;
  }

  return null;
}

function timeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);

  return `${years}y ago`;
}

function isRemote(job) {
  return /\b(remote|wfh|work from home)\b/i.test(
    `${job.title || ""} ${job.location || ""}`
  );
}

function hasSalary(job) {
  return Boolean(clean(job.salary));
}

// ======================================================
// BADGE
// ======================================================

function Badge({
  children,
  tone = "default",
}) {
  const styles = {
    default:
      "border-border bg-surface-alt text-muted",

    primary:
      "border-primary/20 bg-primary/10 text-primary",

    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[tone] || styles.default
      }`}
    >
      {children}
    </span>
  );
}

// ======================================================
// JOB CARD
// ======================================================

function JobCard({ job }) {
  const [expanded, setExpanded] =
    useState(false);

  const link = getJobLink(job);

  const description =
    clean(job.description);

  const remote = isRemote(job);

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:border-primary/30">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0 flex-1">

          <h2 className="text-lg font-bold text-ink">
            {job.title || "Untitled position"}
          </h2>

          <p className="mt-1 text-sm font-medium text-ink">
            {job.company ||
              "Company not specified"}
          </p>

          {job.location && (
            <p className="mt-1 text-sm text-muted">
              {job.location}
            </p>
          )}

          {/* BADGES */}

          <div className="mt-3 flex flex-wrap gap-2">

            {remote && (
              <Badge tone="primary">
                Remote
              </Badge>
            )}

            {job.employment_type && (
              <Badge>
                {job.employment_type}
              </Badge>
            )}

            {job.subclassification && (
              <Badge>
                {job.subclassification}
              </Badge>
            )}

            {job.source && (
              <Badge>
                {job.source}
              </Badge>
            )}

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">

          <div className="text-right">

            <p
              className={`text-sm font-semibold ${
                hasSalary(job)
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted"
              }`}
            >
              {hasSalary(job)
                ? clean(job.salary)
                : "Salary not listed"}
            </p>

          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              View Job
            </a>
          )}

        </div>
      </div>

      {/* DESCRIPTION */}

      {description && (
        <div className="mt-5">

          <p
            className="text-sm leading-6 text-muted"
            style={
              expanded
                ? undefined
                : {
                    display:
                      "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient:
                      "vertical",
                    overflow: "hidden",
                  }
            }
          >
            {description}
          </p>

          {description.length > 180 && (
            <button
              type="button"
              onClick={() =>
                setExpanded(
                  (value) => !value
                )
              }
              className="mt-2 text-sm font-semibold text-primary hover:underline"
            >
              {expanded
                ? "Show less"
                : "Show more"}
            </button>
          )}

        </div>
      )}

      {/* FOOTER */}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">

        <span className="text-xs text-muted">
          {job.posted_date
            ? `Posted ${timeAgo(
                job.posted_date
              )}`
            : "Posting date unavailable"}
        </span>

        {job.external_job_id && (
          <span className="text-xs text-muted">
            Job ID: {job.external_job_id}
          </span>
        )}

      </div>
    </article>
  );
}

// ======================================================
// SKELETON
// ======================================================

function JobSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-5">

      <div className="h-5 w-2/3 rounded bg-border" />

      <div className="mt-3 h-4 w-1/3 rounded bg-border" />

      <div className="mt-2 h-4 w-1/4 rounded bg-border" />

      <div className="mt-5 h-4 w-full rounded bg-border" />

      <div className="mt-2 h-4 w-5/6 rounded bg-border" />

      <div className="mt-5 h-8 w-24 rounded bg-border" />

    </div>
  );
}

function JobSkeletons() {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
    >
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <JobSkeleton key={index} />
      ))}
    </div>
  );
}

// ======================================================
// PAGE
// ======================================================

export default function JobsPage() {
  const { user } = useAuth();

  const [jobs, setJobs] =
    useState([]);

  const [jobTitle, setJobTitle] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [importing, setImporting] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [query, setQuery] =
    useState("");

  const [employmentType, setEmploymentType] =
    useState("all");

  const [onlyWithSalary, setOnlyWithSalary] =
    useState(false);

  const runRef = useRef(0);

  // ====================================================
  // LOAD + IMPORT + FETCH JOBS
  // ====================================================

  const loadJobs = useCallback(
    async () => {
      const runId =
        ++runRef.current;

      const isStale = () =>
        runRef.current !== runId;

      setLoading(true);
      setError(null);

      try {
        // ----------------------------------------------
        // 1. GET CURRENT USER
        // ----------------------------------------------

        console.log(
          "========== JOB DEBUG =========="
        );

        console.log(
          "AuthContext user:",
          user
        );

        const userResponse =
          await API.getMe();

        const currentUser =
          userResponse.data?.user ||
          userResponse.data?.data?.user;

        console.log(
          "GET /me user:",
          currentUser
        );

        console.log(
          "Job Titles:",
          currentUser?.JobTitles
        );

        // ----------------------------------------------
        // 2. FIND SELECTED JOB TITLE
        // ----------------------------------------------

        const selectedJob =
          currentUser?.JobTitles?.[0] ||
          user?.JobTitles?.[0] ||
          null;

        console.log(
          "Selected Job:",
          selectedJob
        );

        console.log(
          "Job Title ID:",
          selectedJob?.job_title_id
        );

        console.log(
          "Job Title Name:",
          selectedJob?.job_title_name
        );

        // ----------------------------------------------
        // 3. NO JOB TITLE
        // ----------------------------------------------

        if (!selectedJob) {
          if (!isStale()) {
            setJobTitle(null);
            setJobs([]);
            setError(
              "You don't have a job title selected yet."
            );
            setLoading(false);
          }

          return;
        }

        // ----------------------------------------------
        // 4. INVALID JOB TITLE ID
        // ----------------------------------------------

        if (!selectedJob.job_title_id) {
          console.error(
            "Invalid job title:",
            selectedJob
          );

          if (!isStale()) {
            setJobTitle(
              selectedJob
            );

            setJobs([]);

            setError(
              "Your selected job title does not have a valid job title ID."
            );

            setLoading(false);
          }

          return;
        }

        setJobTitle(
          selectedJob
        );

        // ----------------------------------------------
        // 5. IMPORT JOBS
        // ----------------------------------------------

        console.log(
          "================================"
        );

        console.log(
          "IMPORTING JOBS"
        );

        console.log(
          "Job Title ID:",
          selectedJob.job_title_id
        );

        console.log(
          "================================"
        );

        if (!isStale()) {
          setImporting(true);
        }

        try {
          const importResponse =
            await API.importJobsByJobTitle(
              selectedJob.job_title_id
            );

          console.log(
            "Import response:",
            importResponse.data
          );

        } catch (importError) {

          console.error(
            "Job import failed:",
            importError.response?.data ||
              importError
          );

          /*
           * We do NOT immediately stop here.
           *
           * There may already be jobs stored in the
           * database, so we continue and try to fetch them.
           */

        } finally {

          if (!isStale()) {
            setImporting(false);
          }

        }

        // ----------------------------------------------
        // 6. FETCH IMPORTED JOBS
        // ----------------------------------------------

        console.log(
          "Fetching saved jobs for:",
          selectedJob.job_title_id
        );

        const response =
          await API.getJobsByJobTitle(
            selectedJob.job_title_id
          );

        console.log(
          "Jobs API response:",
          response.data
        );

        if (isStale()) {
          return;
        }

        const fetchedJobs =
          response.data?.data?.jobs ||
          response.data?.jobs ||
          [];

        console.log(
          "Fetched jobs:",
          fetchedJobs
        );

        console.log(
          "Job count:",
          fetchedJobs.length
        );

        setJobs(
          fetchedJobs
        );

        // ----------------------------------------------
        // 7. NO JOBS AFTER IMPORT
        // ----------------------------------------------

        if (
          fetchedJobs.length === 0
        ) {
          setError(
            "No jobs were found for this job title."
          );
        }

      } catch (err) {

        if (isStale()) {
          return;
        }

        console.error(
          "Failed to load jobs:",
          err.response?.data ||
            err
        );

        setJobs([]);

        setError(
          err.response?.data?.message ||
            "Failed to load jobs."
        );

      } finally {

        if (!isStale()) {
          setLoading(false);
          setImporting(false);
        }

      }
    },
    [user]
  );

  // ====================================================
  // RUN ON PAGE LOAD
  // ====================================================

  useEffect(() => {
    loadJobs();

    return () => {
      runRef.current += 1;
    };
  }, [loadJobs]);

  // ====================================================
  // EMPLOYMENT TYPES
  // ====================================================

  const employmentTypes =
    useMemo(() => {
      return [
        ...new Set(
          jobs
            .map(
              (job) =>
                clean(
                  job.employment_type
                )
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [jobs]);

  // ====================================================
  // FILTER JOBS
  // ====================================================

  const visibleJobs =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      return jobs
        .filter((job) => {

          // Employment type

          if (
            employmentType !==
              "all" &&
            clean(
              job.employment_type
            ) !== employmentType
          ) {
            return false;
          }

          // Salary

          if (
            onlyWithSalary &&
            !hasSalary(job)
          ) {
            return false;
          }

          // Search

          if (!search) {
            return true;
          }

          return [
            job.title,
            job.company,
            job.location,
            job.description,
            job.employment_type,
            job.subclassification,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(search)
            );
        })
        .sort((a, b) => {

          const dateA =
            new Date(
              a.posted_date
            ).getTime();

          const dateB =
            new Date(
              b.posted_date
            ).getTime();

          if (
            Number.isNaN(dateA) &&
            Number.isNaN(dateB)
          ) {
            return 0;
          }

          if (Number.isNaN(dateA)) {
            return 1;
          }

          if (Number.isNaN(dateB)) {
            return -1;
          }

          return dateB - dateA;
        });
    }, [
      jobs,
      query,
      employmentType,
      onlyWithSalary,
    ]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setQuery("");
    setEmploymentType("all");
    setOnlyWithSalary(false);
  };

  const filtersActive =
    query.trim() !== "" ||
    employmentType !== "all" ||
    onlyWithSalary;

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">

        <div>
          <h1 className="text-3xl font-bold text-ink">
            Jobs
          </h1>

          <p className="mt-2 text-sm text-muted">
            {importing
              ? "Importing the latest job listings..."
              : "Loading job listings..."}
          </p>
        </div>

        {importing && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">

            <div className="flex items-center gap-3">

              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

              <div>
                <p className="font-semibold text-ink">
                  Importing latest jobs
                </p>

                <p className="text-sm text-muted">
                  We're fetching the latest listings
                  for your target job.
                </p>
              </div>

            </div>

          </div>
        )}

        <JobSkeletons />

      </section>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-ink">
            Jobs
          </h1>

          <p className="mt-2 text-sm text-muted">

            {jobTitle
              ? `Opportunities for ${jobTitle.job_title_name}`
              : "Opportunities based on your skills"}

          </p>

        </div>

        {/* REFRESH / IMPORT */}

        <button
          type="button"
          onClick={loadJobs}
          disabled={loading || importing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >

          {importing && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          )}

          {importing
            ? "Importing..."
            : "Refresh Jobs"}

        </button>

      </div>

      {/* =================================================
          ERROR / EMPTY NOTICE
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          JOB COUNT
      ================================================= */}

      {jobs.length > 0 && (
        <div className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-ink">
            {visibleJobs.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink">
            {jobs.length}
          </span>{" "}
          jobs
        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      {jobs.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">

            {/* SEARCH */}

            <input
              type="search"
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search jobs, companies, or locations..."
              aria-label="Search jobs"
              className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {/* EMPLOYMENT TYPE */}

            <select
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(
                  e.target.value
                )
              }
              aria-label="Filter by employment type"
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >

              <option value="all">
                All employment types
              </option>

              {employmentTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>

            {/* SALARY */}

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-ink">

              <input
                type="checkbox"
                checked={
                  onlyWithSalary
                }
                onChange={(e) =>
                  setOnlyWithSalary(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-primary"
              />

              Salary listed

            </label>

          </div>

          {/* CLEAR */}

          {filtersActive && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}

        </div>
      )}

      {/* =================================================
          NO JOBS
      ================================================= */}

      {jobs.length === 0 && !error && (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">

          <h2 className="text-lg font-bold text-ink">
            No jobs found
          </h2>

          <p className="mt-2 text-sm text-muted">
            No listings are currently available
            for{" "}
            {jobTitle
              ? jobTitle.job_title_name
              : "your selected job"}.
          </p>

          <button
            type="button"
            onClick={loadJobs}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Try Importing Again
          </button>

        </div>
      )}

      {/* =================================================
          NO FILTER RESULTS
      ================================================= */}

      {jobs.length > 0 &&
        visibleJobs.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">

            <h2 className="font-bold text-ink">
              No matching jobs
            </h2>

            <p className="mt-2 text-sm text-muted">
              Try changing your search or
              filters.
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>

          </div>
        )}

      {/* =================================================
          JOB LIST
      ================================================= */}

      {visibleJobs.length > 0 && (
        <div className="space-y-4">

          {visibleJobs.map(
            (job, index) => (
              <JobCard
                key={
                  job.external_job_id ||
                  job.id ||
                  `${job.title}-${index}`
                }
                job={job}
              />
            )
          )}

        </div>
      )}

    </section>
  );
}
