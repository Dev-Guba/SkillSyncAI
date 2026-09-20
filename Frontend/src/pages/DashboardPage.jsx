import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";
import SkillPreview from "@/components/dashboard/SkillPreview";
import RecommendationPreview from "@/components/dashboard/RecommendationPreview";
import MissingSkills from "@/components/dashboard/MissingSkills";
import JobPreview from "@/components/dashboard/JobPreview";
import RoadmapPreview from "@/components/dashboard/RoadmapPreview";
import QuickActions from "@/components/dashboard/QuickActions";

import { API } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useJobMatches } from "@/components/dashboard/Usejobmatches";

/* ------------------------------------------------------------------ */
/* Readiness card                                                      */
/* ------------------------------------------------------------------ */

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function readinessLabel(pct) {
    if (pct >= 80) return "Strong match";
    if (pct >= 50) return "Getting close";
    if (pct >= 25) return "Building up";
    return "Just starting";
}

function ReadinessRing({ value }) {
    const pct = Math.min(100, Math.max(0, value));

    return (
        <div className="relative h-32 w-32 shrink-0">
            <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
            >
                <circle
                    cx="60"
                    cy="60"
                    r={RING_RADIUS}
                    fill="none"
                    strokeWidth="10"
                    className="stroke-slate-100"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={RING_RADIUS}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * (1 - pct / 100)}
                    className="stroke-teal-600 transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">
                    {pct}%
                </span>
            </div>
        </div>
    );
}

function ReadinessCard({ state, readiness, jobName, missingCount, onRetry }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Career readiness
            </h2>

            {state === "loading" && (
                <div
                    className="mt-4 flex animate-pulse items-center gap-5"
                    role="status"
                    aria-label="Loading your career readiness"
                >
                    <div className="h-32 w-32 shrink-0 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 w-24 rounded bg-slate-200" />
                        <div className="h-3 w-full rounded bg-slate-100" />
                        <div className="h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                </div>
            )}

            {state === "nojob" && (
                <p className="mt-2 text-sm text-slate-600">
                    Add a target job title to your profile to see how well your
                    skills match it.
                </p>
            )}

            {state === "error" && (
                <div
                    role="alert"
                    className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                >
                    <p>We couldn't load your readiness score.</p>
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-2 rounded-md border border-rose-300 bg-white px-3 py-1 font-medium hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                        Try again
                    </button>
                </div>
            )}

            {state === "ready" && (
                <div className="mt-4 flex items-center gap-5">
                    <ReadinessRing value={readiness} />

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                            {readinessLabel(readiness)}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                            Skill match with{" "}
                            <span className="font-medium text-slate-800">
                                {jobName || "your target job"}
                            </span>
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                            {missingCount > 0
                                ? `${missingCount} skill${
                                      missingCount === 1 ? "" : "s"
                                  } to learn to close the gap.`
                                : "No skill gaps found."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
    const { user } = useAuth();

    const [aiData, setAiData] = useState(null);
    const [aiStatus, setAiStatus] = useState("loading"); // loading | ready | error
    const [reloadKey, setReloadKey] = useState(0);

    const userId = user?.user_id;
    const targetJob = user?.JobTitles?.[0];
    const jobTitleId = targetJob?.job_title_id;

    useEffect(() => {
        if (!userId || !jobTitleId) return;

        let cancelled = false;

        setAiStatus("loading");

        API.getAIRecommendation({
            user_id: userId,
            job_title_id: jobTitleId,
        })
            .then((response) => {
                if (cancelled) return;
                setAiData(response.data?.data ?? null);
                setAiStatus("ready");
            })
            .catch((error) => {
                if (cancelled) return;
                console.error("AI Recommendation Error:", error);
                setAiStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [userId, jobTitleId, reloadKey]);

    // ==========================================
    // CAREER READINESS
    // ==========================================

    const cosineSimilarity = Number(aiData?.analysis?.cosine_similarity || 0);
    const careerReadiness = Math.round(cosineSimilarity * 100);

    const missingSkills = aiData?.analysis?.missing_skills || [];
    const learningRecommendations =
        aiData?.recommendation?.learning_recommendations || [];

    // loading | ready | error | nojob  (shared by every AI-driven card)
    const aiState = !user ? "loading" : !jobTitleId ? "nojob" : aiStatus;

    const retryAI = () => setReloadKey((k) => k + 1);

    // Skills the user already has for this role. Adjust the field name
    // if your API calls it something else.
    const matchedSkills = aiData?.analysis?.matched_skills || [];

    // Job listings are loaded once here and shared with StatsCards + JobPreview
    const jobMatches = useJobMatches(jobTitleId);
    const jobsState = !user
        ? "loading"
        : !jobTitleId
        ? "nojob"
        : jobMatches.status;

    return (
        <section className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <DashboardHeader />

            {/* STATISTICS */}
            <StatsCards
                skillsToLearn={missingSkills.length}
                jobCount={jobMatches.jobs.length}
                aiState={aiState}
                jobsState={jobsState}
                jobName={targetJob?.job_title_name}
            />

            {/*
              TWO COLUMNS
              Left  (4 cols): you — readiness, profile, quick actions, skills
              Right (8 cols): what's next — gaps, recommendations, roadmap, jobs
            */}
            <div className="grid items-start gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-4">
                    <ReadinessCard
                        state={aiState}
                        readiness={careerReadiness}
                        jobName={targetJob?.job_title_name}
                        missingCount={missingSkills.length}
                        onRetry={retryAI}
                    />

                    <ProfileCompletionCard />

                    <QuickActions />

                    <SkillPreview />
                </div>

                <div className="space-y-6 lg:col-span-8">
                    <MissingSkills skills={missingSkills} />

                    <RecommendationPreview
                        readiness={careerReadiness}
                        recommendations={learningRecommendations}
                    />

                    <RoadmapPreview
                        completed={matchedSkills}
                        upcoming={missingSkills}
                        state={aiState}
                        onRetry={retryAI}
                    />

                    <JobPreview
                        jobs={jobMatches.jobs}
                        state={jobsState}
                        jobName={targetJob?.job_title_name}
                        userSkills={matchedSkills}
                        onRetry={jobMatches.reload}
                        onImport={jobMatches.importJobs}
                        importing={jobMatches.importing}
                        importFailed={jobMatches.importFailed}
                    />
                </div>
            </div>
        </section>
    );
}