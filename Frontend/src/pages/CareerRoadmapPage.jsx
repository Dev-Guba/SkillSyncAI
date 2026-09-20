import { useMemo, useState } from "react";
import API from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PERIOD_PRESETS = [3, 6, 9, 12];
const MAX_PERIODS = 12;

/*
 * Colors
 * ------
 * Surfaces, text, borders and the accent use the app's theme tokens
 * (bg-surface, text-ink, text-muted, border-border, primary), so they follow
 * light/dark mode automatically, the same way the dashboard does.
 * Only status colors (green/red) need explicit dark: variants.
 */

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function statusStyle(status) {
  const s = String(status || "").toLowerCase();

  if (/^(rising|increas|grow|up|emerging)/.test(s)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (/^(declin|decreas|fall|down|shrink)/.test(s)) {
    return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
  }
  return "border-border text-muted";
}

function getChange(item) {
  const last = item.history?.at(-1);
  const end = item.forecast?.at(-1);

  if (!last || !end) return null;

  const from = Number(last.demand) || 0;
  const to = Number(end.predicted_demand) || 0;
  const diff = to - from;

  return {
    from,
    to,
    diff,
    pct: from > 0 ? Math.round((diff / from) * 100) : null,
    month: end.month,
  };
}

function formatDelta(change) {
  if (!change) return "";
  if (change.pct === null) {
    return change.diff > 0 ? `up ${change.diff}` : "no change";
  }
  return `${change.pct > 0 ? "+" : ""}${change.pct}%`;
}

function deltaColor(diff) {
  if (diff > 0) return "text-emerald-700 dark:text-emerald-400";
  if (diff < 0) return "text-rose-700 dark:text-rose-400";
  return "text-muted";
}

const jobsLabel = (n) => `${n} job${n === 1 ? "" : "s"}`;

/* ------------------------------------------------------------------ */
/* Demand chart (history solid, forecast dashed on a tinted band)      */
/* ------------------------------------------------------------------ */

function DemandChart({ history = [], forecast = [], skill }) {
  const W = 640;
  const H = 150;
  const padX = 10;
  const padTop = 14;
  const padBottom = 12;

  const hist = history.map((h) => ({
    label: h.month,
    value: Number(h.demand) || 0,
  }));
  const fore = forecast.map((f) => ({
    label: f.month,
    value: Number(f.predicted_demand) || 0,
  }));
  const all = [...hist, ...fore];

  if (all.length === 0) return null;

  const max = Math.max(...all.map((p) => p.value), 1);
  const x = (i) =>
    all.length > 1
      ? padX + (i * (W - padX * 2)) / (all.length - 1)
      : W / 2;
  const y = (v) => padTop + (1 - v / max) * (H - padTop - padBottom);

  const toPath = (pts) =>
    pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");

  const histPts = hist.map((p, i) => [x(i), y(p.value)]);
  const lastHistIdx = hist.length - 1;
  const forePts =
    fore.length > 0
      ? [
          ...(lastHistIdx >= 0 ? [histPts[lastHistIdx]] : []),
          ...fore.map((p, i) => [x(hist.length + i), y(p.value)]),
        ]
      : [];

  const bandStart = lastHistIdx >= 0 ? x(lastHistIdx) : padX;
  const first = all[0];
  const last = all[all.length - 1];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Demand for ${skill}: ${hist.length} months of history${
          fore.length ? ` and ${fore.length} months forecast` : ""
        }. Peak ${max} jobs.`}
      >
        {fore.length > 0 && (
          <rect
            x={bandStart}
            y={0}
            width={W - bandStart}
            height={H}
            className="fill-primary/10"
          />
        )}

        <line
          x1={padX}
          x2={W - padX}
          y1={H - padBottom}
          y2={H - padBottom}
          className="stroke-border"
          strokeWidth="1"
        />

        {histPts.length > 1 && (
          <path
            d={toPath(histPts)}
            fill="none"
            className="stroke-ink"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {forePts.length > 1 && (
          <path
            d={toPath(forePts)}
            fill="none"
            className="stroke-primary"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {histPts.map((p, i) => (
          <circle
            key={`h-${i}`}
            cx={p[0]}
            cy={p[1]}
            r={i === lastHistIdx ? 4.5 : 3}
            className="fill-surface stroke-ink"
            strokeWidth="2"
          />
        ))}

        {fore.map((p, i) => (
          <circle
            key={`f-${i}`}
            cx={x(hist.length + i)}
            cy={y(p.value)}
            r={i === fore.length - 1 ? 4.5 : 3}
            className="fill-surface stroke-primary"
            strokeWidth="2"
          />
        ))}
      </svg>

      <figcaption className="mt-1 flex items-center justify-between text-xs text-muted">
        <span>{first.label}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-ink" />
            Actual
          </span>
          {fore.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-4 border-t-2 border-dashed border-primary" />
              Predicted
            </span>
          )}
        </span>
        <span>{last.label}</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Loading UI                                                          */
/* ------------------------------------------------------------------ */

function ProgressSteps({ stage }) {
  const steps = [
    { id: "importing", label: "Import job market data" },
    { id: "forecasting", label: "Generate forecast" },
  ];
  const activeIndex = steps.findIndex((s) => s.id === stage);

  return (
    <ol className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;

        return (
          <li
            key={step.id}
            className={`flex items-center gap-2 ${
              active ? "font-medium text-ink" : "text-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                done
                  ? "bg-primary text-white"
                  : active
                  ? "border-2 border-primary"
                  : "border border-border"
              }`}
              aria-hidden="true"
            >
              {done ? "✓" : ""}
            </span>
            {step.label}
            {active && <span className="sr-only"> (in progress)</span>}
          </li>
        );
      })}
    </ol>
  );
}

function SkeletonCards() {
  return (
    <div className="mt-4 grid gap-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-border bg-surface p-5"
        >
          <div className="h-5 w-40 rounded bg-border" />
          <div className="mt-4 h-28 rounded bg-border opacity-60" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 rounded bg-border opacity-60" />
            <div className="h-16 rounded bg-border opacity-60" />
            <div className="h-16 rounded bg-border opacity-60" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skill card                                                          */
/* ------------------------------------------------------------------ */

function SkillCard({ item }) {
  const change = getChange(item);
  const hasForecast = item.forecast?.length > 0;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{item.skill}</h3>

          {change && (
            <p className="mt-1 text-sm text-muted">
              Demand goes from{" "}
              <span className="font-medium text-ink">
                {jobsLabel(change.from)}
              </span>{" "}
              to{" "}
              <span className="font-medium text-ink">
                {jobsLabel(change.to)}
              </span>{" "}
              by {change.month}{" "}
              <span className={`font-semibold ${deltaColor(change.diff)}`}>
                ({formatDelta(change)})
              </span>
            </p>
          )}
        </div>

        {item.status && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle(
              item.status
            )}`}
          >
            {item.status}
          </span>
        )}
      </header>

      <div className="mt-4">
        <DemandChart
          history={item.history}
          forecast={item.forecast}
          skill={item.skill}
        />
      </div>

      {hasForecast ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {item.forecast.map((f, i) => {
            const prev =
              i === 0
                ? Number(item.history?.at(-1)?.demand)
                : Number(item.forecast[i - 1].predicted_demand);
            const diff = Number.isFinite(prev)
              ? Number(f.predicted_demand) - prev
              : 0;

            return (
              <div
                key={f.month}
                className="rounded-xl border border-primary/20 bg-primary/5 p-3"
              >
                <p className="text-sm text-muted">{f.month}</p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-ink">
                    {f.predicted_demand}
                  </span>
                  {Number.isFinite(prev) && diff !== 0 && (
                    <span
                      className={`text-xs font-medium ${deltaColor(diff)}`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">predicted jobs</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border p-3">
          <p className="text-sm text-muted">
            There isn't enough history to forecast this skill yet. The chart
            shows the demand we have so far.
          </p>
        </div>
      )}

      {item.history?.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer rounded text-sm font-medium text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Show monthly history
          </summary>

          <ul className="mt-3 flex flex-wrap gap-2">
            {item.history.map((h) => (
              <li
                key={h.month}
                className="rounded-lg border border-border px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-ink">{h.month}</span>
                <span className="ml-2 text-muted">{jobsLabel(h.demand)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CareerRoadmapPage() {
  const { user } = useAuth();

  const [periods, setPeriods] = useState("");
  const [skills, setSkills] = useState([]);
  const [stage, setStage] = useState("idle"); // idle | importing | forecasting
  const [error, setError] = useState(null);
  const [importMessage, setImportMessage] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [sortBy, setSortBy] = useState("growth");

  const loading = stage !== "idle";
  const jobTitle = user?.JobTitles?.[0];

  async function generateForecast(e) {
    e?.preventDefault();

    const months = Number(periods);

    if (!periods || !Number.isInteger(months) || months < 1) {
      setError("Enter a whole number of months, from 1 to 12.");
      return;
    }

    if (months > MAX_PERIODS) {
      setError(`You can forecast up to ${MAX_PERIODS} months ahead.`);
      return;
    }

    const jobTitleId = jobTitle?.job_title_id;

    const programId =
      user?.program_id ||
      user?.UserProfile?.program_id ||
      user?.userProfile?.program_id;

    if (!jobTitleId) {
      setError(
        "Your account has no target job title. Add one in your profile, then try again."
      );
      return;
    }

    if (!programId) {
      setError(
        "Your account has no program. Add one in your profile, then try again."
      );
      return;
    }

    try {
      setError(null);
      setSkills([]);
      setImportMessage("");
      setHasRun(true);

      // Step 1: import job market data
      setStage("importing");

      const importResponse = await API.importJobsByJobTitle(jobTitleId);
      const importedCount = importResponse.data?.data?.count || 0;

      setImportMessage(
        `Imported ${importedCount} job${importedCount === 1 ? "" : "s"} for ${
          jobTitle?.job_title_name || "your target job"
        }.`
      );

      // Step 2: generate forecast
      setStage("forecasting");

      const response = await API.getSkillForecasts(programId, months);

      setSkills(response.data?.data || []);
    } catch (err) {
      console.error("Skill forecast error:", err);

      setError(
        err.response?.data?.message ||
          "We couldn't generate the forecast. Check your connection and try again."
      );
    } finally {
      setStage("idle");
    }
  }

  const sortedSkills = useMemo(() => {
    const list = [...skills];

    if (sortBy === "name") {
      return list.sort((a, b) => String(a.skill).localeCompare(String(b.skill)));
    }

    if (sortBy === "demand") {
      const latest = (s) =>
        Number(
          s.forecast?.at(-1)?.predicted_demand ?? s.history?.at(-1)?.demand ?? 0
        );
      return list.sort((a, b) => latest(b) - latest(a));
    }

    // growth: biggest predicted change first, skills with no forecast last
    const growth = (s) => {
      const c = getChange(s);
      return c ? c.diff : -Infinity;
    };
    return list.sort((a, b) => growth(b) - growth(a));
  }, [skills, sortBy]);

  const summary = useMemo(() => {
    const rising = skills.filter((s) => {
      const c = getChange(s);
      return c && c.diff > 0;
    }).length;
    const noData = skills.filter((s) => !s.forecast?.length).length;
    return { rising, noData };
  }, [skills]);

  const showEmpty = !loading && !error && !hasRun && skills.length === 0;
  const showNoResults = !loading && !error && hasRun && skills.length === 0;

  return (
    <section className="mx-auto max-w-4xl p-4 sm:p-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Skill demand forecast
        </h1>
        <p className="mt-2 max-w-prose text-muted">
          See which skills employers are asking for now and how demand is
          likely to change
          {jobTitle?.job_title_name ? (
            <>
              {" "}
              for{" "}
              <span className="font-medium text-ink">
                {jobTitle.job_title_name}
              </span>
            </>
          ) : null}
          .
        </p>
      </header>

      {/* Controls */}
      <form
        onSubmit={generateForecast}
        className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-soft"
        noValidate
      >
        <fieldset disabled={loading} className="m-0 border-0 p-0">
          <legend className="text-lg font-semibold text-ink">
            How far ahead?
          </legend>
          <p className="mt-1 text-sm text-muted">
            Pick a preset or enter your own number of months.
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div
              className="flex gap-2"
              role="group"
              aria-label="Forecast period presets"
            >
              {PERIOD_PRESETS.map((n) => {
                const active = Number(periods) === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setPeriods(String(n));
                      setError(null);
                    }}
                    aria-pressed={active}
                    className={`rounded-lg border px-3.5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-ink hover:bg-primary/5"
                    }`}
                  >
                    {n} mo
                  </button>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="forecast-months"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Months
              </label>
              <input
                id="forecast-months"
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX_PERIODS}
                value={periods}
                onChange={(e) => {
                  setPeriods(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 4"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "forecast-error" : undefined}
                className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Working…" : "Generate forecast"}
            </button>
          </div>
        </fieldset>

        {loading && (
          <div role="status" aria-live="polite">
            <ProgressSteps stage={stage} />
          </div>
        )}

        {!loading && importMessage && (
          <p className="mt-4 text-sm text-muted" role="status">
            {importMessage}
          </p>
        )}

        {error && (
          <div
            id="forecast-error"
            role="alert"
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {error}
          </div>
        )}
      </form>

      {/* Loading skeleton */}
      {loading && <SkeletonCards />}

      {/* Results */}
      {!loading && skills.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">
                Forecast results
              </h2>
              <p className="mt-1 text-sm text-muted">
                {skills.length} skill{skills.length === 1 ? "" : "s"} analysed.{" "}
                {summary.rising} predicted to rise
                {summary.noData > 0
                  ? `, ${summary.noData} without enough data`
                  : ""}
                .
              </p>
            </div>

            <div>
              <label htmlFor="sort-skills" className="mr-2 text-sm text-muted">
                Sort by
              </label>
              <select
                id="sort-skills"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="growth">Biggest predicted growth</option>
                <option value="demand">Highest predicted demand</option>
                <option value="name">Skill name</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            {sortedSkills.map((item) => (
              <SkillCard key={item.skill} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state: before first run */}
      {showEmpty && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <h2 className="text-lg font-semibold text-ink">No forecast yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Choose a forecast period above and select Generate forecast to see
            predicted skill demand.
          </p>
        </div>
      )}

      {/* Empty state: ran but nothing came back */}
      {showNoResults && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <h2 className="text-lg font-semibold text-ink">No skills found</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            We didn't find any skill data for your program yet. Try a different
            period or check back after more job data is imported.
          </p>
        </div>
      )}
    </section>
  );
}