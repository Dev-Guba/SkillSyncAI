import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { API } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// ==========================================
// HELPERS
// ==========================================

const slugify = (text = "") =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Resource URLs come from an AI model, so only allow real web links.
const isSafeUrl = (url) => /^https?:\/\//i.test(url || "");

const norm = (text = "") => String(text).toLowerCase().trim();

const asList = (value) =>
  Array.isArray(value) ? value : typeof value === "string" && value ? [value] : [];

// Turns a possibly-missing API value into a finite number, or null.
const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

// Find the recommendations array wherever the backend nests it.
const pickRecommendations = (body) => {
  const candidates = [
    body?.data?.data?.recommendations,
    body?.data?.recommendations,
    body?.recommendations,
    body?.data?.data,
    body?.data,
    body,
  ];

  return candidates.find(Array.isArray) || [];
};

// Accept a few likely field names so small backend changes don't blank the page.
const normalizeRecommendation = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const skill = raw.skill || raw.skill_name;
  if (!skill) return null;

  return {
    skill,
    description: raw.description || raw.summary || "",
    fundamentals: asList(raw.fundamentals || raw.topics || raw.key_topics).filter(
      (item) => typeof item === "string"
    ),
    where_to_learn: asList(raw.where_to_learn || raw.resources).filter(
      (item) => item && typeof item === "object"
    ),
    practice: raw.practice || raw.practice_project || raw.exercise || "",
    isFallback: false,
  };
};

// Used when the AI plan is missing for a skill, so the person still has a next step.
const buildFallback = (skill) => {
  const q = encodeURIComponent(skill);

  return {
    skill,
    description:
      "No AI learning plan came back for this skill. These searches are a quick way to start.",
    fundamentals: [],
    where_to_learn: [
      {
        title: `${skill} tutorials`,
        source: "YouTube",
        url: `https://www.youtube.com/results?search_query=learn+${q}+tutorial`,
      },
      {
        title: `Learn ${skill}`,
        source: "Google",
        url: `https://www.google.com/search?q=learn+${q}+for+beginners`,
      },
    ],
    practice: "",
    isFallback: true,
  };
};

const scoreTone = (pct) => {
  if (pct >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
};

const similarityNote = (pct) => {
  if (pct >= 75) return "Your skills line up closely with this career.";
  if (pct >= 40) return "Partly aligned, with clear gaps to fill.";
  return "Your skills are mostly different from what this career asks for.";
};

// ==========================================
// SMALL COMPONENTS
// ==========================================

function MatchRing({ value, label = "match", ariaLabel }) {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative h-24 w-24 shrink-0"
      role="img"
      aria-label={ariaLabel || `${pct} percent ${label}`}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          className={`stroke-current transition-all duration-700 motion-reduce:transition-none ${scoreTone(pct)}`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-bold leading-none ${scoreTone(pct)}`}>
          {pct}%
        </span>
        <span className="mt-1 text-xs text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function ScoreTile({ value, label, title, children }) {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)));

  return (
    <div className="flex items-center gap-4">
      <MatchRing
        value={value}
        label={label}
        ariaLabel={`${title}: ${pct} percent`}
      />

      <div className="min-w-0">
        <h2 className="font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ScoreExplainer({ hasCosine }) {
  return (
    <details className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
      <summary className="cursor-pointer rounded text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        How are these scores calculated?
      </summary>

      <div className="mt-4 space-y-5 text-sm text-slate-700 dark:text-slate-300">
        <div>
          <h3 className="font-semibold">Skill match</h3>
          <p className="mt-1 max-w-prose">
            The share of the skills this career asks for that you already
            have. It answers a simple question: how much of the list have I
            covered?
          </p>
        </div>

        {hasCosine && (
          <div>
            <h3 className="font-semibold">
              Profile similarity (cosine similarity)
            </h3>

            <p className="mt-1 max-w-prose">
              Cosine similarity compares your whole set of skills with the
              career's whole set of skills. Picture each set as an arrow: the
              more the two arrows point the same way, the more alike your
              profiles are. A score of 1 (100%) means they line up exactly,
              and 0 means they share nothing.
            </p>

            <p className="mt-2 max-w-prose">
              It looks at both sets together, so it can come out lower than
              your skill match when you have many skills this career doesn't
              list.
            </p>

            <p className="mt-2">
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">
                similarity = (A · B) ÷ (‖A‖ × ‖B‖)
              </code>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              A is your skills and B is the career's skills.
            </p>
          </div>
        )}

        {hasCosine && (
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="font-semibold">A simple example</h3>
            <p className="mt-1 max-w-prose">
              A career asks for 4 skills. You have 6 skills, and 3 of them are
              on the career's list. Counting each skill as either present or
              absent:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Skill match: 3 of 4 = 75%</li>
              <li>Cosine similarity: 3 ÷ √(4 × 6) ≈ 61%</li>
            </ul>
            <p className="mt-2 max-w-prose text-slate-500">
              The cosine score is lower because 3 of your skills aren't on the
              career's list.
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function PageHeader({ jobName, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Recommended Skills</h1>
      <p className="mt-2 text-slate-500">
        {subtitle}
        {jobName && (
          <>
            {" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {jobName}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}

function RecommendationSkeletons({ count }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <p className="text-sm text-slate-500">
        Building your learning plan. Your skill gap is ready above.
      </p>

      {Array.from({ length: Math.min(Math.max(count, 2), 4) }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"
        >
          <SkeletonBlock className="h-5 w-1/3" />
          <SkeletonBlock className="mt-3 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function RecommendationCard({ recommendation, open, onToggle }) {
  const id = slugify(recommendation.skill);
  const resources = (recommendation.where_to_learn || []).filter((r) =>
    isSafeUrl(r.url)
  );
  const [primary, ...otherResources] = resources;

  return (
    <div
      id={`skill-${id}`}
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
    >
      {/* HEADER: always visible, so the main action is one click away */}

      <div className="flex items-center gap-3 p-4 sm:p-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`panel-${id}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">{recommendation.skill}</h3>

            {!open && recommendation.description && (
              <p className="mt-1 truncate text-sm text-slate-500">
                {recommendation.description}
              </p>
            )}
          </div>

          <ChevronIcon open={open} />
        </button>

        {primary && (
          <a
            href={primary.url}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:inline-block"
          >
            Start learning
          </a>
        )}
      </div>

      {/* BODY */}

      {open && (
        <div
          id={`panel-${id}`}
          className="space-y-6 border-t border-slate-200 p-4 dark:border-slate-700 sm:p-5"
        >
          {recommendation.description && (
            <p className="max-w-prose text-slate-700 dark:text-slate-300">
              {recommendation.description}
            </p>
          )}

          {/* Primary action, repeated for mobile where the header link is hidden */}
          {primary && (
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-indigo-500 sm:hidden"
            >
              Start with {primary.title}
            </a>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* FUNDAMENTALS */}

            {recommendation.fundamentals?.length > 0 && (
              <div>
                <h4 className="font-semibold">What to learn first</h4>

                <ul className="mt-3 space-y-2">
                  {recommendation.fundamentals.map((item, i) => (
                    <li
                      key={`${item}-${i}`}
                      className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WHERE TO LEARN */}

            {resources.length > 0 && (
              <div>
                <h4 className="font-semibold">Where to learn</h4>

                <ul className="mt-3 space-y-2">
                  {[primary, ...otherResources].map((resource, i) => (
                    <li key={`${resource.url}-${i}`}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <span className="font-medium">{resource.title}</span>
                        {resource.source && (
                          <span className="ml-2 text-slate-500">
                            {resource.source}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* PRACTICE */}

          {recommendation.practice && (
            <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/40">
              <h4 className="font-semibold">Practice this</h4>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {recommendation.practice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function RecommendedSkillsPage() {
  const { user } = useAuth();

  const [aiData, setAiData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [openSkill, setOpenSkill] = useState(null);

  const [gapLoading, setGapLoading] = useState(true);
  const [learningLoading, setLearningLoading] = useState(false);

  const [gapError, setGapError] = useState("");
  const [learningError, setLearningError] = useState("");

  // Ignore results from an older run if the user changes or the page reloads
  const runRef = useRef(0);

  const jobTitle = user?.JobTitles?.[0];

  const load = useCallback(async () => {
    const runId = ++runRef.current;
    const isStale = () => runRef.current !== runId;

    setGapError("");
    setLearningError("");
    setRecommendations([]);
    setOpenSkill(null);

    if (!jobTitle) {
      setGapLoading(false);
      setGapError(
        "No target job title found. Select a target career to see your skill gap."
      );
      return;
    }

    // ------------------------------------------
    // STEP 1: SKILL GAP (show this as soon as it lands)
    // ------------------------------------------

    setGapLoading(true);

    let data;

    try {
      const analysisResponse = await API.getAIRecommendation({
        user_id: user.user_id,
        job_title_id: jobTitle.job_title_id,
      });

      data = analysisResponse.data?.data;

      if (!data) throw new Error("No AI analysis returned.");
    } catch (err) {
      if (isStale()) return;
      console.error("Skill gap error:", err.response?.data || err);
      setGapError("We couldn't analyze your skills. Try again in a moment.");
      setGapLoading(false);
      return;
    }

    if (isStale()) return;

    setAiData(data);
    setGapLoading(false);

    // ------------------------------------------
    // STEP 2: LEARNING PLAN (loads in the background)
    // ------------------------------------------

    const missing = data.analysis?.missing_skills || [];

    if (!missing.length) return;

    setLearningLoading(true);

    try {
      const learningResponse = await API.getLearningRecommendations({
        job_title: jobTitle.job_title_name,
        missing_skills: missing,
      });

      if (isStale()) return;

      // Temporary: check this in the browser console if the plan looks wrong,
      // then remove it.
      console.log("LEARNING RAW RESPONSE:", learningResponse.data);

      const list = pickRecommendations(learningResponse.data)
        .map(normalizeRecommendation)
        .filter(Boolean);

      setRecommendations(list);
      setOpenSkill(list[0]?.skill ?? null);
    } catch (err) {
      if (isStale()) return;
      console.error("Learning recommendations error:", err.response?.data || err);
      setLearningError(
        err.response?.data?.message
          ? `We couldn't build your learning plan (${err.response.data.message}).`
          : "We couldn't build your learning plan."
      );
    } finally {
      if (!isStale()) setLearningLoading(false);
    }
  }, [user, jobTitle]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const analysis = aiData?.analysis || {};
  const missingSkills = analysis.missing_skills || [];
  const matchedSkills = analysis.matched_skills || [];

  // ------------------------------------------
  // SCORES
  // ------------------------------------------

  const requiredCount = matchedSkills.length + missingSkills.length;

  // Prefer the API's match_percentage; fall back to matched / required
  const matchPct =
    toNumberOrNull(analysis.match_percentage) ??
    (requiredCount > 0 ? (matchedSkills.length / requiredCount) * 100 : 0);

  // Cosine similarity comes back as 0 to 1; show it as a percentage too
  const cosine = toNumberOrNull(analysis.cosine_similarity);
  const hasCosine = cosine !== null;
  const cosinePct = hasCosine
    ? Math.max(0, Math.min(100, Math.round(cosine * 100)))
    : 0;

  // Match a missing skill to an AI card, tolerating naming differences
  // such as "React" vs "React.js".
  const findPlanFor = useCallback(
    (skill) =>
      recommendations.find((r) => {
        const a = norm(r.skill);
        const b = norm(skill);
        return a === b || a.includes(b) || b.includes(a);
      }),
    [recommendations]
  );

  // Every missing skill gets a card: the AI plan if we have it, quick links if not.
  const planItems = useMemo(() => {
    const extras = missingSkills
      .filter((skill) => !findPlanFor(skill))
      .map(buildFallback);

    return [...recommendations, ...extras];
  }, [recommendations, missingSkills, findPlanFor]);

  const jumpToSkill = (skill) => {
    const match = findPlanFor(skill) || planItems.find((p) => norm(p.skill) === norm(skill));
    if (!match) return;

    setOpenSkill(match.skill);

    // Wait a frame so the card has expanded before scrolling
    requestAnimationFrame(() => {
      document
        .getElementById(`skill-${slugify(match.skill)}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // ==========================================
  // LOADING (skill gap only, kept short)
  // ==========================================

  if (gapLoading) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 p-6" aria-busy="true">
        <PageHeader subtitle="Checking your skills against" jobName={jobTitle?.job_title_name} />

        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
          <div className="flex items-center gap-5">
            <SkeletonBlock className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-1/2" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (gapError) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 p-6">
        <PageHeader subtitle="Skills to build for" jobName={jobTitle?.job_title_name} />

        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/30"
        >
          <p className="text-rose-700 dark:text-rose-300">{gapError}</p>

          {jobTitle && (
            <button
              type="button"
              onClick={load}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              Try again
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!aiData) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 p-6">
        <PageHeader subtitle="Skills to build for" jobName={jobTitle?.job_title_name} />
        <p className="text-slate-500">No skill gap information available.</p>
      </section>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <section className="mx-auto max-w-4xl space-y-8 p-6">
      <PageHeader subtitle="Skills to build for" jobName={jobTitle?.job_title_name} />

      {/* SKILL GAP SUMMARY */}

      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700 sm:p-6">
        {/* SCORES */}

        <div
          className={`grid gap-6 ${hasCosine ? "sm:grid-cols-2" : ""}`}
        >
          <ScoreTile value={matchPct} label="match" title="Skill match">
            <p className="mt-1 text-sm text-slate-500">
              {requiredCount > 0
                ? `You have ${matchedSkills.length} of the ${requiredCount} skills this career asks for.`
                : "No required skills were listed for this career."}
            </p>
          </ScoreTile>

          {hasCosine && (
            <ScoreTile
              value={cosinePct}
              label="similar"
              title="Profile similarity"
            >
              <p className="mt-1 text-sm text-slate-500">
                {similarityNote(cosinePct)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Cosine similarity:{" "}
                <span className="font-medium tabular-nums text-slate-700 dark:text-slate-300">
                  {cosine.toFixed(2)}
                </span>
              </p>
            </ScoreTile>
          )}
        </div>

        <ScoreExplainer hasCosine={hasCosine} />

        {/* SKILL LISTS */}

        <div className="mt-6 space-y-5 border-t border-slate-200 pt-6 dark:border-slate-700">
          {missingSkills.length === 0 ? (
            <div>
              <h2 className="text-xl font-semibold">You're all caught up</h2>
              <p className="mt-1 text-slate-500">
                Your skills cover everything this career requires.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold">
                Skills to develop ({missingSkills.length})
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a skill to jump to its learning plan.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {missingSkills.map((skill) => {
                  const ready = !learningLoading;

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => jumpToSkill(skill)}
                      disabled={!ready}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        ready
                          ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                          : "cursor-default border-slate-200 text-slate-500 dark:border-slate-700"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchedSkills.length > 0 && (
            <div>
              <h2 className="font-semibold">
                Skills you already have ({matchedSkills.length})
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LEARNING PLAN */}

      {missingSkills.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              How to develop these skills
            </h2>
            <p className="mt-1 text-slate-500">
              AI-generated plan based on your missing skills.
            </p>
          </div>

          {learningLoading && (
            <RecommendationSkeletons count={missingSkills.length} />
          )}

          {!learningLoading && (learningError || recommendations.length === 0) && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <p className="text-amber-900 dark:text-amber-200">
                {learningError
                  ? `${learningError} Quick search links are shown below instead.`
                  : "The AI didn't return a learning plan. Quick search links are shown below instead."}
              </p>

              <button
                type="button"
                onClick={load}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {!learningLoading && (
            <div className="space-y-3">
              {planItems.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.skill}
                  recommendation={recommendation}
                  open={openSkill === recommendation.skill}
                  onToggle={() =>
                    setOpenSkill((current) =>
                      current === recommendation.skill
                        ? null
                        : recommendation.skill
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}