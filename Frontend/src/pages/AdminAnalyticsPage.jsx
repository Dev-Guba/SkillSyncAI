import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { API } from "@/api/api.js";

const PERIOD_OPTIONS = [
  { value: 3, label: "Next 3 Months" },
  { value: 6, label: "Next 6 Months" },
  { value: 12, label: "Next 12 Months" },
];

const FALLBACK_PROGRAMS = [
  { program_id: 1, program_code: "BSCS", program_name: "BS Computer Science" },
  { program_id: 2, program_code: "BSIT", program_name: "BS Information Technology" },
];

const FALLBACK_FORECASTS = [
  { skill_name: "Python", demand_score: 92, growth_rate: 18, trend: "rising" },
  { skill_name: "React", demand_score: 86, growth_rate: 14, trend: "rising" },
  { skill_name: "Cloud & DevOps", demand_score: 81, growth_rate: 22, trend: "rising" },
  { skill_name: "SQL & Databases", demand_score: 76, growth_rate: 6, trend: "rising" },
  { skill_name: "TypeScript", demand_score: 74, growth_rate: 15, trend: "rising" },
  { skill_name: "Legacy jQuery", demand_score: 34, growth_rate: -11, trend: "declining" },
];

function normalizeForecastItems(raw) {
  const list =
    raw?.forecasts || raw?.skills || raw?.data || (Array.isArray(raw) ? raw : []);
  if (!Array.isArray(list) || list.length === 0) return [];

  return list.map((item, idx) => {
    const name =
      item.skill_name ||
      item.skill_set_name ||
      item.skill ||
      item.name ||
      `Skill #${idx + 1}`;
    const growth = Number(
      item.growth_rate ?? item.change_percentage ?? item.delta ?? 0
    );
    const score = Math.min(
      100,
      Math.max(
        10,
        Number(
          item.demand_score ??
            item.predicted_demand ??
            item.score ??
            item.forecast_value ??
            65
        )
      )
    );
    const trend =
      item.trend ||
      (growth < 0 ? "declining" : "rising");

    return {
      skill_name: name,
      demand_score: Math.round(score),
      growth_rate: Number.isFinite(growth) ? Math.round(growth) : 0,
      trend,
    };
  });
}

export default function AdminAnalyticsPage() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [periods, setPeriods] = useState(6);
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

  const risingCount = forecasts.filter((f) => f.trend !== "declining").length;
  const decliningCount = forecasts.filter((f) => f.trend === "declining").length;
  const avgDemand =
    forecasts.length > 0
      ? Math.round(
          forecasts.reduce((acc, cur) => acc + cur.demand_score, 0) /
            forecasts.length
        )
      : 0;

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

        <div className="flex flex-wrap gap-1.5 rounded-xl bg-surface-alt p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriods(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                periods === opt.value
                  ? "bg-surface text-primary shadow-soft"
                  : "text-muted hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
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
              Avg Demand Score
            </span>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">{avgDemand}%</p>
        </div>
      </div>

      {/* Forecast Bars */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Projected Skill Demand ({periods} months)
            </h2>
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
              const isDeclining = item.trend === "declining";
              return (
                <div key={item.skill_name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink">
                      {item.skill_name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isDeclining
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        }`}
                      >
                        {isDeclining ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {item.growth_rate > 0 ? `+${item.growth_rate}%` : `${item.growth_rate}%`}
                      </span>
                      <span className="w-10 text-right text-xs font-bold text-muted">
                        {item.demand_score}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
                    <div
                      style={{ width: `${item.demand_score}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDeclining
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF]"
                      }`}
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