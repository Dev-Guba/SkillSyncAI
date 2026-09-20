import { Link } from "react-router-dom";
import { ArrowRight, Check, Map } from "lucide-react";

// How many steps the preview shows on each side of "now".
const MAX_DONE = 2;
const MAX_UPCOMING = 3;

/*
 * The AI response may return skills as plain strings or as objects.
 * If your objects use a different field name, add it here.
 */
function getSkillName(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.skill_name || item.skill || item.name || item.title || "";
}

function toNames(list) {
  const seen = new Set();

  return (Array.isArray(list) ? list : [])
    .map((item) => String(getSkillName(item)).trim())
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function RoadmapSkeleton() {
  return (
    <div
      className="mt-5 animate-pulse space-y-4"
      role="status"
      aria-label="Loading your roadmap"
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-5 shrink-0 rounded-full bg-border" />
          <div
            className="h-4 rounded bg-border"
            style={{ width: `${70 - i * 10}%` }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Props
 * - completed: skills the user already has (strings or objects)
 * - upcoming:  skills the user still needs, in the order to learn them
 * - state:     "loading" | "ready" | "error" | "nojob"
 * - onRetry:   called when the user retries after an error
 */
export default function RoadmapPreview({
  completed = [],
  upcoming = [],
  state = "ready",
  onRetry,
}) {
  const done = toNames(completed);
  const doneKeys = new Set(done.map((n) => n.toLowerCase()));
  const todo = toNames(upcoming).filter((n) => !doneKeys.has(n.toLowerCase()));

  const total = done.length + todo.length;
  const percent = total > 0 ? Math.round((done.length / total) * 100) : 0;

  // Without any completed skills a 0% bar would be misleading, so hide it.
  const showProgress = done.length > 0 && total > 0;

  const visibleDone = done.slice(-MAX_DONE);
  const visibleTodo = todo.slice(0, MAX_UPCOMING);
  const hiddenDone = done.length - visibleDone.length;
  const hiddenTodo = todo.length - visibleTodo.length;

  const steps = [
    ...visibleDone.map((title) => ({ title, done: true })),
    ...visibleTodo.map((title, i) => ({ title, done: false, next: i === 0 })),
  ];

  const subtitle = showProgress
    ? `${done.length} of ${total} skills covered`
    : todo.length > 0
    ? `${todo.length} skill${todo.length === 1 ? "" : "s"} to learn`
    : "Your suggested learning journey.";

  return (
    <div
      className="
      rounded-3xl
      border border-border
      bg-surface
      p-6
      shadow-soft
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Career roadmap</h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>

        <Map className="shrink-0 text-primary" aria-hidden="true" />
      </div>

      {showProgress && state === "ready" && (
        <div
          role="progressbar"
          aria-label="Roadmap progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mt-4 h-2 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* States */}

      {state === "loading" && <RoadmapSkeleton />}

      {state === "nojob" && (
        <p className="mt-5 text-sm text-muted">
          Choose a target job title in your profile and we'll build a learning
          path for it.
        </p>
      )}

      {state === "error" && (
        <div role="alert" className="mt-5 text-sm text-muted">
          <p>We couldn't load your roadmap right now.</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 rounded-md font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {state === "ready" && steps.length === 0 && (
        <p className="mt-5 text-sm text-muted">
          No roadmap steps yet. Add your skills to your profile to get one.
        </p>
      )}

      {state === "ready" && steps.length > 0 && (
        <>
          {hiddenDone > 0 && (
            <p className="mt-5 text-xs text-muted">
              {hiddenDone} earlier skill{hiddenDone === 1 ? "" : "s"} already
              covered
            </p>
          )}

          <ol className={hiddenDone > 0 ? "mt-3" : "mt-5"}>
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;

              const dot = step.done
                ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                : step.next
                ? "h-5 w-5 rounded-full border-2 border-primary bg-surface"
                : "h-5 w-5 rounded-full border-2 border-border bg-surface";

              return (
                <li key={step.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={dot} aria-hidden="true">
                      {step.done && <Check size={12} strokeWidth={3} />}
                    </span>
                    {!isLast && (
                      <span
                        className="w-px flex-1 bg-border"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className={isLast ? "" : "pb-4"}>
                    <p
                      className={
                        step.done
                          ? "text-sm font-medium text-ink"
                          : step.next
                          ? "text-sm font-semibold text-ink"
                          : "text-sm text-muted"
                      }
                    >
                      <span className="sr-only">
                        {step.done ? "Covered: " : step.next ? "Up next: " : "To learn: "}
                      </span>
                      {step.title}
                    </p>

                    {step.next && (
                      <p className="text-xs text-primary">Up next</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {hiddenTodo > 0 && (
            <p className="mt-3 text-xs text-muted">
              and {hiddenTodo} more to learn
            </p>
          )}
        </>
      )}

      <Link
        to="/dashboard/roadmap"
        className="
        mt-6
        inline-flex
        items-center
        gap-2
        rounded-md
        font-semibold
        text-primary
        transition-colors
        hover:text-primary/80
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        "
      >
        View full roadmap
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}