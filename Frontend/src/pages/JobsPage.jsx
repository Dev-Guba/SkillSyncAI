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
// #19: SKILL EXTRACTION & MATCHING HELPERS
// ======================================================

function normalizeSkillName(item) {
  if (!item) return "";
  if (typeof item === "string") return clean(item);
  if (typeof item === "object") {
    return clean(
      item.skill_set_name ||
        item.skill_name ||
        item.name ||
        item.SkillSet?.skill_set_name ||
        item.Skill?.skill_name ||
        ""
    );
  }
  return "";
}

function extractStudentSkills(userObj) {
  if (!userObj) return [];

  const rawList =
    userObj.SkillSets ||
    userObj.UserSkills ||
    userObj.skills ||
    userObj.user_skills ||
    userObj.UserProfile?.SkillSets ||
    [];

  const names = Array.isArray(rawList)
    ? rawList.map(normalizeSkillName).filter(Boolean)
    : [];

  return [...new Set(names)];
}

function extractStoredJobSkills(job) {
  if (!job) return [];

  const rawCandidates =
    job.extracted_skills ??
    job.extractedSkills ??
    job.job_skills ??
    job.jobSkills ??
    job.JobSkills ??
    job.SkillSets ??
    job.skills ??
    job.required_skills;

  let list = [];

  if (Array.isArray(rawCandidates)) {
    list = rawCandidates.map(normalizeSkillName).filter(Boolean);
  } else if (typeof rawCandidates === "string") {
    const trimmed = rawCandidates.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          list = parsed.map(normalizeSkillName).filter(Boolean);
        }
      } catch {
        list = trimmed.split(",").map(clean).filter(Boolean);
      }
    } else if (trimmed) {
      list = trimmed.split(",").map(clean).filter(Boolean);
    }
  }

  return [...new Set(list)];
}

function computeJobSkillMatch(job, studentSkills = []) {
  const storedJobSkills = extractStoredJobSkills(job);
  const studentLowerMap = new Map(
    studentSkills.map((s) => [s.toLowerCase(), s])
  );

  // If the job has stored/extracted skills, compare against student's skills
  if (storedJobSkills.length > 0) {
    const matched = [];
    const missing = [];

    storedJobSkills.forEach((jobSkill) => {
      const lower = jobSkill.toLowerCase();
      const directMatch = studentLowerMap.get(lower);

      if (directMatch) {
        matched.push(jobSkill);
      } else {
        // Also check partial word match (e.g., "React.js" vs "React")
        const partial = studentSkills.some((stuSkill) => {
          const sLow = stuSkill.toLowerCase();
          return (
            sLow === lower ||
            (sLow.length >= 3 && lower.includes(sLow)) ||
            (lower.length >= 3 && sLow.includes(lower))
          );
        });

        if (partial) {
          matched.push(jobSkill);
        } else {
          missing.push(jobSkill);
        }
      }
    });

    const percentage = Math.round(
      (matched.length / storedJobSkills.length) * 100
    );

    return {
      totalJobSkills: storedJobSkills.length,
      matchedSkills: matched,
      missingSkills: missing,
      matchPercentage: percentage,
    };
  }

  // Fallback: if a job record has no stored skill array yet, check which of the student's skills appear in the title/description
  if (studentSkills.length > 0) {
    const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();
    const matched = studentSkills.filter((stuSkill) =>
      text.includes(stuSkill.toLowerCase())
    );
    const percentage = Math.round(
      (matched.length / studentSkills.length) * 100
    );

    return {
      totalJobSkills: studentSkills.length,
      matchedSkills: matched,
      missingSkills: [],
      matchPercentage: percentage,
    };
  }

  return {
    totalJobSkills: 0,
    matchedSkills: [],
    missingSkills: [],
    matchPercentage: null,
  };
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

    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
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

function JobCard({ job, studentSkills }) {
  const [expanded, setExpanded] =
    useState(false);

  const link = getJobLink(job);

  const description =
    clean(job.description);

  const remote = isRemote(job);

  // #19: Compare stored job skills with student's skills
  const {
    totalJobSkills,
    matchedSkills,
    missingSkills,
    matchPercentage,
  } = useMemo(
    () => computeJobSkillMatch(job, studentSkills),
    [job, studentSkills]
  );

  const matchTone =
    matchPercentage >= 70
      ? "success"
      : matchPercentage >= 40
      ? "warning"
      : "default";

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:border-primary/30">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-ink">
              {job.title || "Untitled position"}
            </h2>

            {matchPercentage !== null && (
              <Badge tone={matchTone}>
                {matchPercentage}% Skill Match
              </Badge>
            )}
          </div>

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

      {/* #19: SKILL MATCH BREAKDOWN */}
      {totalJobSkills > 0 && (
        <div className="mt-4 rounded-xl border border-border/70 bg-surface-alt/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <span>
              Matched {matchedSkills.length} of {totalJobSkills} job skills
            </span>
            <span className="text-primary">{matchPercentage}%</span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] transition-all"
              style={{ width: `${Math.min(100, Math.max(0, matchPercentage || 0))}%` }}
            />
          </div>

          {(matchedSkills.length > 0 || missingSkills.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <span
                  key={`match-${skill}`}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  ✓ {skill}
                </span>
              ))}

              {missingSkills.map((skill) => (
                <span
                  key={`miss-${skill}`}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

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

  const [studentSkills, setStudentSkills] =
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

        const userResponse =
          await API.getMe();

        const currentUser =
          userResponse.data?.user ||
          userResponse.data?.data?.user;

        // #19: Store student's skills for comparison
        const extractedUserSkills = extractStudentSkills(
          currentUser || user
        );
        if (!isStale()) {
          setStudentSkills(extractedUserSkills);
        }

        // ----------------------------------------------
        // 2. FIND SELECTED JOB TITLE
        // ----------------------------------------------

        const selectedJob =
          currentUser?.JobTitles?.[0] ||
          user?.JobTitles?.[0] ||
          null;

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

        if (!isStale()) {
          setImporting(true);
        }

        try {
          await API.importJobsByJobTitle(
            selectedJob.job_title_id
          );
        } catch (importError) {
          console.error(
            "Job import failed:",
            importError.response?.data ||
              importError
          );
        } finally {
          if (!isStale()) {
            setImporting(false);
          }
        }

        // ----------------------------------------------
        // 6. FETCH IMPORTED JOBS
        // ----------------------------------------------

        const response =
          await API.getJobsByJobTitle(
            selectedJob.job_title_id
          );

        if (isStale()) {
          return;
        }

        const fetchedJobs =
          response.data?.data?.jobs ||
          response.data?.jobs ||
          [];

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
                studentSkills={studentSkills}
              />
            )
          )}

        </div>
      )}

    </section>
  );
}