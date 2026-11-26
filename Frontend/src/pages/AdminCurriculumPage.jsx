import { useCallback, useEffect, useState } from "react";
import { BookOpen, RefreshCw, Loader2, Download } from "lucide-react";

import { API } from "@/api/api.js";
import PageHeader from "@/components/common/PageHeader";
import CurriculumAlignmentView from "@/components/curriculum/CurriculumAlignmentView";

const CONF_TONE = {
  good: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  moderate: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  low: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  none: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

// Admin view of curriculum alignment across all programs (Objective 2.4)
export default function AdminCurriculumPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [version, setVersion] = useState(0); // bump to reload the detail view

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.adminCurriculumOverview();
      const list = res.data?.data || [];
      setRows(list);
      setSelected((current) => current ?? list.find((r) => r.postings_with_skills > 0)?.program.program_id ?? list[0]?.program.program_id ?? null);
    } catch (err) {
      setNotice({ tone: "error", text: err.response?.data?.message || "Couldn't load the overview." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [collecting, setCollecting] = useState(false);

  // Starts a background job collection run for every program's careers
  const collect = async () => {
    setCollecting(true);
    setNotice(null);
    try {
      const res = await API.adminRunScheduledImport();
      setNotice({
        tone: "success",
        text: `${res.data?.message || "Job collection started."} Up to ${res.data?.max_careers ?? 10} careers this run (about a minute each). Reload this page later to see updated numbers.`,
      });
    } catch (err) {
      setNotice({ tone: "error", text: err.response?.data?.message || "Couldn't start job collection." });
    } finally {
      setCollecting(false);
    }
  };

  const reanalyze = async () => {
    setReanalyzing(true);
    setNotice(null);
    try {
      const res = await API.adminReanalyzeJobSkills();
      const d = res.data?.data || {};
      setNotice({
        tone: "success",
        text: `Re-analyzed ${d.jobs} saved postings: ${d.jobs_with_skills} now have identified skills (${d.skill_links} skill links).`,
      });
      await load();
      setVersion((v) => v + 1);
    } catch (err) {
      setNotice({ tone: "error", text: err.response?.data?.message || "Couldn't re-analyze the saved jobs." });
    } finally {
      setReanalyzing(false);
    }
  };

  return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={BookOpen}
        eyebrow="Admin • Curriculum alignment"
        title="Curriculum vs job market"
        subtitle="For each program: which in-demand Cebu skills it teaches, and which it misses."
        actions={
          <>
          <button
            type="button"
            onClick={collect}
            disabled={collecting}
            title="Import Cebu jobs for the careers of every program (the ones imported longest ago first)"
            className="bg-brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 disabled:opacity-60"
          >
            {collecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Collect jobs now
          </button>
          <button
            type="button"
            onClick={reanalyze}
            disabled={reanalyzing}
            title="Re-extract skills from all saved job postings using the current skill catalog"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-primary/40 hover:text-primary disabled:opacity-60"
          >
            {reanalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {reanalyzing ? "Re-analyzing..." : "Re-analyze saved jobs"}
          </button>
          </>
        }
      />

      {notice && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            notice.tone === "error"
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {notice.text}
        </p>
      )}

      {/* Overview table */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-bold text-ink">All programs</h2>
          <p className="text-xs text-muted">Click a program to see its details below.</p>
        </div>
        {loading ? (
          <p className="flex items-center gap-2 p-6 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-alt text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-6 py-3">Program</th>
                  <th className="px-6 py-3">Postings</th>
                  <th className="px-6 py-3">Alignment</th>
                  <th className="px-6 py-3" title="TF-IDF cosine similarity, curriculum vs job market">Cosine</th>
                  <th className="px-6 py-3">Top gaps</th>
                  <th className="px-6 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const active = r.program.program_id === selected;
                  return (
                    <tr
                      key={r.program.program_id}
                      onClick={() => setSelected(r.program.program_id)}
                      className={`cursor-pointer transition ${active ? "bg-primary/5" : "hover:bg-surface-alt"}`}
                    >
                      <td className="px-6 py-3">
                        <p className="font-semibold text-ink">{r.program.program_code}</p>
                        <p className="text-xs text-muted">{r.program.program_name}</p>
                      </td>
                      <td className="px-6 py-3 text-xs text-muted">
                        {r.postings_with_skills} with skills / {r.postings}
                      </td>
                      <td className="px-6 py-3">
                        {r.coverage_percent === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-alt">
                              <div className="bg-brand-gradient h-full rounded-full" style={{ width: `${r.coverage_percent}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-ink">{r.coverage_percent}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-xs font-semibold tabular-nums text-ink">
                        {typeof r.cosine === "number" ? r.cosine.toFixed(2) : "—"}
                      </td>
                      <td className="px-6 py-3 text-xs text-muted">{r.top_gaps.join(", ") || "—"}</td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${CONF_TONE[r.confidence] || CONF_TONE.none}`}>
                          {r.confidence === "none" ? "No data" : r.confidence}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail */}
      {selected && <CurriculumAlignmentView key={`${selected}-${version}`} programId={selected} audience="admin" />}
    </section>
  );
}
