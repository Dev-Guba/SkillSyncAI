import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Loader2,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { API } from "@/api/api.js";

// Same horizons as the user-facing forecast (CareerRoadmapPage): 1–5 years
const PERIOD_OPTIONS = [12, 24, 36, 48, 60];
const MAX_PERIODS = 60;

const FALLBACK_PROGRAMS = [
  { program_id: 1, program_code: "BSCS", program_name: "BS Computer Science" },
  { program_id: 2, program_code: "BSIT", program_name: "BS Information Technology" },
];

const FALLBACK_FORECASTS = [
  { skill_name: "Python", current_share: 38, projected_share: 44.5, change: 6.5, trend: "rising" },
  { skill_name: "React", current_share: 31, projected_share: 35.2, change: 4.2, trend: "rising" },
  { skill_name: "Cloud & DevOps", current_share: 24, projected_share: 30.1, change: 6.1, trend: "rising" },
  { skill_name: "SQL & Databases", current_share: 29, projected_share: 29.4, change: 0.4, trend: "stable" },
  { skill_name: "TypeScript", current_share: 20, projected_share: 24.8, change: 4.8, trend: "rising" },
  { skill_name: "Legacy jQuery", current_share: 9, projected_share: 5.3, change: -3.7, trend: "declining" },
];

// Forecast values are "% of job postings that mention the skill" (share)
const shareOf = (h) => Number(h?.share ?? h?.demand) || 0;
const round1 = (n) => Math.round(n * 10) / 10;

function formatPeriod(months) {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? "Year" : "Years"}`;
  }
  return `${months} ${months === 1 ? "Month" : "Months"}`;
}

function trendFromStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s.startsWith("rising")) return "rising";
  if (s.startsWith("declin")) return "declining";
  if (s.startsWith("stable")) return "stable";
  return "insufficient";
}

// Backend shape (trendServices.getSkillForecasts):
// { skill, history: [{ month, demand, total, share }], forecast: [{ month, predicted_demand }], status }
function normalizeForecastItems(raw) {
  const list = raw?.data ?? (Array.isArray(raw) ? raw : []);
  if (!Array.isArray(list)) return [];

  return list
    .map((item, idx) => {
      const current = shareOf(item.history?.at(-1));
      const end = item.forecast?.at(-1);
      const projected = end
        ? round1(Math.min(100, Math.max(0, Number(end.predicted_demand) || 0)))
        : null;

      return {
        skill_name: item.skill || `Skill #${idx + 1}`,
        current_share: current,
        projected_share: projected,
        change: projected === null ? null : round1(projected - current),
        trend: trendFromStatus(item.status),
      };
    })
    .sort(
      (a, b) =>
        (b.projected_share ?? b.current_share) -
        (a.projected_share ?? a.current_share)
    );
}

const TREND_BADGE = {
  rising:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  declining:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  stable: "bg-surface-alt text-muted",
  insufficient: "bg-surface-alt text-muted",
};

const TREND_BAR = {
  rising: "bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF]",
  declining: "bg-amber-500",
  stable: "bg-[#7A5CFF]/60",
  insufficient: "bg-border",
};

function ChangeBadge({ item }) {
  const Icon =
    item.trend === "rising"
      ? TrendingUp
      : item.trend === "declining"
        ? TrendingDown
        : Minus;

  const label =
    item.change === null
      ? "Not enough data"
      : `${item.change > 0 ? "+" : ""}${item.change} pts`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TREND_BADGE[item.trend]}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function AdminAnalyticsPage() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [periods, setPeriods] = useState(36);
  const [customMonths, setCustomMonths] = useState("36");
  const [monthsError, setMonthsError] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadPrograms() {
      try {
        const res = await API.getAllPrograms();
        const data = res.data?.data || res.data || [];
        const finalPrograms =
          Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROGRAMS;
        if (active) {
          setPrograms(finalPrograms);
          setSelectedProgramId(String(finalPrograms[0].program_id));
        }
      } catch {
        if (active) {
          setPrograms(FALLBACK_PROGRAMS);
          setSelectedProgramId(String(FALLBACK_PROGRAMS[0].program_id));
        }
      }
    }
    loadPrograms();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProgramId) return;
    let active = true;

    async function loadForecasts() {
      setLoading(true);
      try {
        const res = await API.getSkillForecasts(selectedProgramId, periods);
        const normalized = normalizeForecastItems(res.data);
        if (active) {
          if (normalized.length > 0) {
            setForecasts(normalized);
            setUsingFallback(false);
          } else {
            setForecasts(FALLBACK_FORECASTS);
            setUsingFallback(true);
          }
        }
      } catch {
        if (active) {
          setForecasts(FALLBACK_FORECASTS);
          setUsingFallback(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadForecasts();
    return () => {
      active = false;
    };
  }, [selectedProgramId, periods]);

  function selectPreset(months) {
    setPeriods(months);
    setCustomMonths(String(months));
    setMonthsError(null);
  }

  function applyCustomMonths(e) {
    e.preventDefault();
    const months = Number(customMonths);
    if (!customMonths || !Number.isInteger(months) || months < 1) {
      setMonthsError("Enter a whole number of months, from 1 to 60.");
      return;
    }
    if (months > MAX_PERIODS) {
      setMonthsError("You can forecast up to 5 years (60 months) ahead.");
      return;
    }
    setMonthsError(null);
    setPeriods(months);
  }

  const risingCount = forecasts.filter((f) => f.trend === "rising").length;
  const decliningCount = forecasts.filter((f) => f.trend === "declining").length;
  const withForecast = forecasts.filter((f) => f.projected_share !== null);
  const avgDemand =
    withForecast.length > 0
      ? round1(
          withForecast.reduce((acc, cur) => acc + cur.projected_share, 0) /
            withForecast.length
        )
      : 0;

  // Shares are often small (e.g. 5–40%), so bar length is relative to the top skill
  const maxShare = Math.max(
    1,
    ...forecasts.map((f) => f.projected_share ?? f.current_share)
  );

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Skill Trends & Analytics
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">
          Skill Demand Forecasts
        </h1>
        <p className="mt-1 text-sm text-muted">
          Track rising and declining skill demand across academic programs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            <GraduationCap className="h-4 w-4 text-primary" />
            Program:
          </span>
          {programs.map((program) => {
            const idStr = String(program.program_id);
            const active = selectedProgramId === idStr;
            return (
              <button
                key={idStr}
                type="button"
                onClick={() => setSelectedProgramId(idStr)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-xs"
                    : "border border-border bg-surface-alt/50 text-ink hover:border-primary"
                }`}
              >
                {program.program_code || program.program_name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex flex-wrap gap-1.5 rounded-xl bg-surface-alt p-1"
              role="group"
              aria-label="Forecast period"
            >
              {PERIOD_OPTIONS.map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => selectPreset(months)}
                  aria-pressed={periods === months}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    periods === months
                      ? "bg-surface text-primary shadow-soft"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {formatPeriod(months)}
                </button>
              ))}
            </div>

            <form
              onSubmit={applyCustomMonths}
              className="flex items-center gap-1.5"
              noValidate
            >
              <label
                htmlFor="admin-forecast-months"
                className="text-xs font-semibold text-muted"
              >
                Months:
              </label>
              <input
                id="admin-forecast-months"
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX_PERIODS}
                step="1"
                value={customMonths}
                onChange={(e) => {
                  setCustomMonths(e.target.value);
                  setMonthsError(null);
                }}
                placeholder="e.g. 18"
                aria-invalid={Boolean(monthsError)}
                aria-describedby={monthsError ? "admin-months-error" : undefined}
                className="w-20 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Apply
              </button>
            </form>
          </div>

          {monthsError && (
            <p
              id="admin-months-error"
              role="alert"
              className="text-xs text-rose-700 dark:text-rose-300"
            >
              {monthsError}
            </p>
          )}
        </div>
      </div>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Rising Skills</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">{risingCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">
              Declining Skills
            </span>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {decliningCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">
              Avg Projected Share of Postings
            </span>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {withForecast.length > 0 ? `${avgDemand}%` : "—"}
          </p>
        </div>
      </div>

      {/* Forecast Bars */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-ink">
                Projected Skill Demand ({formatPeriod(periods).toLowerCase()})
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              % of job postings mentioning each skill at the end of the
              forecast. Change is in percentage points from the latest month.
            </p>
          </div>
          {usingFallback && (
            <span className="rounded-full bg-surface-alt px-3 py-1 text-[11px] font-medium text-muted">
              Showing preview data (live forecast endpoint empty/offline)
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">Calculating skill forecasts...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {forecasts.map((item) => {
              const value = item.projected_share ?? item.current_share;
              return (
                <div key={item.skill_name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-ink">
                      {item.skill_name}
                    </span>
                    <div className="flex items-center gap-3">
                      <ChangeBadge item={item} />
                      <span className="w-12 text-right text-xs font-bold text-muted">
                        {value}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
                    <div
                      style={{ width: `${(value / maxShare) * 100}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${TREND_BAR[item.trend]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
