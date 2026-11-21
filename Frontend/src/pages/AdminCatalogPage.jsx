import { useEffect, useState } from "react";
import { GraduationCap, Briefcase } from "lucide-react";
import { API } from "@/api/api.js";

export default function AdminCatalogPage() {
  const [programs, setPrograms] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadCatalog() {
      const [progRes, jobRes] = await Promise.allSettled([
        API.getAllPrograms(),
        API.getAllJobSkills(),
      ]);

      if (!active) return;

      const pList =
        progRes.status === "fulfilled"
          ? progRes.value.data?.data || progRes.value.data || []
          : [];
      const jList =
        jobRes.status === "fulfilled"
          ? jobRes.value.data?.data || jobRes.value.data || []
          : [];

      setPrograms(Array.isArray(pList) ? pList : []);
      setJobTitles(Array.isArray(jList) ? jList : []);
    }
    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Catalog
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">
          Programs & Job Titles
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Programs */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Programs ({programs.length})
            </h2>
          </div>
          {programs.length === 0 ? (
            <p className="text-sm text-muted">No programs available.</p>
          ) : (
            <ul className="space-y-2.5">
              {programs.map((program, idx) => (
                <li
                  key={program.program_id || idx}
                  className="rounded-xl border border-border/70 bg-surface-alt/50 px-4 py-3 text-sm font-medium text-ink"
                >
                  {program.program_code ? `${program.program_code} — ` : ""}
                  {program.program_name || program.name || "Program"}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Job Titles */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Job Titles ({jobTitles.length})
            </h2>
          </div>
          {jobTitles.length === 0 ? (
            <p className="text-sm text-muted">No job titles available.</p>
          ) : (
            <ul className="space-y-2.5">
              {jobTitles.map((job, idx) => (
                <li
                  key={job.job_title_id || idx}
                  className="rounded-xl border border-border/70 bg-surface-alt/50 px-4 py-3 text-sm font-medium text-ink"
                >
                  {job.job_title_name || job.title || job.name || "Job Title"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}