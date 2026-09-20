import { Sparkles, BookOpen, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATE_NOTE = {
  loading: "Loading…",
  nojob: "Choose a target job",
  error: "Couldn't load",
};

function StatValue({ state, value }) {
  if (state === "loading") {
    return (
      <span
        role="status"
        className="inline-block h-9 w-14 animate-pulse rounded-lg bg-border align-middle"
      >
        <span className="sr-only">Loading</span>
      </span>
    );
  }

  if (state === "ready") return value;

  return (
    <span className="text-muted" aria-label="Not available">
      –
    </span>
  );
}

/**
 * Props
 * - skillsToLearn: number of skills the user is missing for the target job
 * - jobCount:      number of job listings saved for the target job
 * - aiState:       "loading" | "ready" | "error" | "nojob"  (for skillsToLearn)
 * - jobsState:     "loading" | "ready" | "error" | "nojob"  (for jobCount)
 * - jobName:       target job title name
 */
export default function StatsCards({
  skillsToLearn = 0,
  jobCount = 0,
  aiState = "ready",
  jobsState = "ready",
  jobName,
}) {
  const { user } = useAuth();

  const skills = user?.SkillSets ?? [];
  const role = jobName || "your target job";

  const cards = [
    {
      title: "Skills added",
      value: skills.length,
      state: "ready",
      subtitle:
        skills.length === 0
          ? "Add skills to see your matches"
          : "Saved to your profile",
      icon: Sparkles,
    },
    {
      title: "Skills to learn",
      value: skillsToLearn,
      state: aiState,
      subtitle:
        skillsToLearn === 0
          ? "You cover every skill we checked"
          : `Needed for ${role}`,
      icon: BookOpen,
    },
    {
      title: "Job openings",
      value: jobCount,
      state: jobsState,
      subtitle:
        jobCount === 0 ? "No listings saved yet" : `Open for ${role}`,
      icon: Briefcase,
    },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
            rounded-2xl
            border border-border
            bg-surface
            p-5
            shadow-soft
            "
          >
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm font-medium text-muted">
                {card.title}
              </dt>

              <span
                className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-primary/10
                "
              >
                <Icon size={20} className="text-primary" aria-hidden="true" />
              </span>
            </div>

            <dd className="mt-3 text-3xl font-bold text-ink">
              <StatValue state={card.state} value={card.value} />
            </dd>

            <dd className="mt-1 text-sm text-muted">
              {card.state === "ready"
                ? card.subtitle
                : STATE_NOTE[card.state]}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}