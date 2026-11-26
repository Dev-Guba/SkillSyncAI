import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Briefcase,
  Loader2,
  Info,
  ArrowRight,
} from "lucide-react";

import { API } from "@/api/api.js";

/*
| Curriculum alignment for one program (Objective 2.4): which skills Cebu
| employers ask for in the program's careers, which of those the program
| teaches, and which it doesn't. Used on the student page (audience
| "student") and the admin page (audience "admin").
*/

const CONFIDENCE = {
  good: { label: "Good", tone: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400", note: null },
  moderate: {
    label: "Moderate",
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    note: "Based on a moderate number of postings. Treat the percentages as indicative.",
  },
  low: {
    label: "Low",
    tone: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    note: "Based on very few postings with identified skills, so these results may change a lot as more jobs are collected.",
  },
  none: {
    label: "No data",
    tone: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    note: "No job postings with identified skills yet for this program's careers.",
  },
};

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function SkillBarList({ items, tone, empty, studentHas, audience }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const has = studentHas?.has(item.skill_set_name.toLowerCase());
        return (
          <li key={item.skill_set_id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
                <span className="truncate">{item.skill_set_name}</span>
                {audience === "student" && has && (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                    You have it
                  </span>
                )}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {item.postings} posting{item.postings === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-alt">
              <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(item.share, 4)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function CurriculumAlignmentView({ programId, audience = "student", studentSkills = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!programId) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    API.getProgramAlignment(programId)
      .then((res) => active && setData(res.data?.data || null))
      .catch((err) => active && setError(err.response?.data?.message || "Couldn't load curriculum alignment."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [programId]);

  if (!programId) {
    return <Card><p className="text-sm text-muted">No program selected.</p></Card>;
  }
  if (loading) {
    return (
      <Card>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Comparing the curriculum with job postings...
        </p>
      </Card>
    );
  }
  if (error || !data) {
    return <Card><p className="text-sm text-red-600">{error || "No data."}</p></Card>;
  }

  const { program, careers, coverage, covered, gaps, unused, emerging } = data;
  const conf = CONFIDENCE[data.data.confidence] || CONFIDENCE.none;
  const studentHas = new Set(studentSkills.map((s) => String(s).toLowerCase()));
  const pct = coverage.percent;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Alignment</p>
          <p className="mt-2 text-4xl font-extrabold text-ink">
            {pct === null ? "—" : <span className="text-brand-gradient">{pct}%</span>}
          </p>
          <p className="mt-1 text-sm text-muted">
            of the skills employers ask for in {program.program_code} careers are taught in the program.
          </p>
          {pct !== null && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-alt">
              <div className="bg-brand-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          )}
          <div className="mt-4 rounded-2xl bg-surface-alt px-3 py-2.5">
            <p className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-medium text-ink">Cosine similarity</span>
              <span className="font-bold tabular-nums text-ink">
                {typeof coverage.cosine === "number" ? coverage.cosine.toFixed(2) : "—"}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted">
              TF-IDF comparison of the curriculum&apos;s skills with job-market demand
              (0 = no overlap, 1 = same skills in the same proportions).
            </p>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">In-demand skills</p>
          <div className="mt-3 flex items-end gap-6">
            <div>
              <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{coverage.covered}</p>
              <p className="text-xs text-muted">taught</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{coverage.gaps}</p>
              <p className="text-xs text-muted">not taught</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">The program lists {coverage.taught} skills in total.</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Based on</p>
          <p className="mt-2 text-3xl font-extrabold text-ink">{data.data.postings_with_skills}</p>
          <p className="text-xs text-muted">
            of {data.data.postings} Cebu postings for {careers.length} career{careers.length === 1 ? "" : "s"} had identifiable skills
          </p>
          <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${conf.tone}`}>
            Confidence: {conf.label}
          </span>
        </Card>
      </div>

      {conf.note && (
        <p className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {conf.note}
        </p>
      )}

      {/* Gaps and covered */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            In demand, not in the program
          </h3>
          <p className="mb-4 mt-1 text-sm text-muted">
            {audience === "student"
              ? "Employers ask for these, but the program doesn't list them. Worth learning on your own."
              : "Curriculum gaps: skills employers ask for that the program doesn't list."}
          </p>
          <SkillBarList
            items={gaps}
            tone="bg-amber-400"
            empty="No gaps found in the current data."
            studentHas={studentHas}
            audience={audience}
          />
          {audience === "student" && gaps.length > 0 && (
            <Link
              to="/dashboard/recommendations"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              See how to learn your missing skills <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            In demand and taught
          </h3>
          <p className="mb-4 mt-1 text-sm text-muted">
            Skills the program covers that employers are asking for.
          </p>
          <SkillBarList
            items={covered}
            tone="bg-brand-gradient"
            empty="None of the program's skills appear in the current postings yet."
            studentHas={studentHas}
            audience={audience}
          />
        </Card>
      </div>

      {/* Emerging + unused */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <TrendingUp className="h-4 w-4 text-primary" />
            Emerging skills
          </h3>
          <p className="mb-4 mt-1 text-sm text-muted">
            New terms found in these postings, not yet in the skill catalog
            {audience === "admin" ? " (review them on Manage Skills)." : "."}
          </p>
          {emerging.length === 0 ? (
            <p className="text-sm text-muted">None right now.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {emerging.map((e) => (
                <span key={e.id} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  {e.name} <span className="text-xs text-muted">· {e.postings}</span>
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <BookOpen className="h-4 w-4 text-muted" />
            Taught, not seen in postings yet
          </h3>
          <p className="mb-4 mt-1 text-sm text-muted">
            {unused.length} of the program&apos;s {coverage.taught} skills don&apos;t appear in the current postings.
            {data.data.confidence !== "good" && " With more job data, many of these may show up."}
          </p>
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {unused.map((u) => (
              <span key={u.skill_set_id} className="rounded-full bg-surface-alt px-3 py-1 text-xs text-muted">
                {u.skill_set_name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Careers */}
      <Card>
        <h3 className="flex items-center gap-2 text-base font-bold text-ink">
          <Briefcase className="h-4 w-4 text-primary" />
          Careers included for {program.program_code}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {careers.map((c) => (
            <span key={c.job_title_id} className="rounded-full border border-border px-3 py-1 text-sm text-ink">
              {c.job_title_name}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
