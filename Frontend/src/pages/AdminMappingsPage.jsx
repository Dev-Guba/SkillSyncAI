
import { useEffect, useState } from "react";
import {
  GitBranch,
  Sparkles,
  Briefcase,
  Search,
  Check,
  Loader2,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

import { API } from "@/api/api.js";
import Button from "@/components/common/Button";

const LOCAL_MAPPINGS_KEY = "skillsync_admin_program_mappings";

const FALLBACK_PROGRAMS = [
  { program_id: 1, program_code: "BSCS", program_name: "BS Computer Science" },
  { program_id: 2, program_code: "BSIT", program_name: "BS Information Technology" },
];

// Extract arrays from different API response structures
function extractArray(response, possibleKeys = []) {
  let data = response?.data;

  for (let i = 0; i < 4; i++) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    const matchingKey = possibleKeys.find((key) =>
      Array.isArray(data[key])
    );

    if (matchingKey) return data[matchingKey];

    data = data.data;
  }

  return Array.isArray(data) ? data : [];
}

function readLocalOverrides() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_MAPPINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function AdminMappingsPage() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [activeTab, setActiveTab] = useState("skills");
  const [search, setSearch] = useState("");

  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [catalogVersion, setCatalogVersion] = useState(0);

  // Master lists
  const [allSkills, setAllSkills] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  // Linked IDs
  const [linkedSkillIds, setLinkedSkillIds] = useState([]);
  const [linkedJobIds, setLinkedJobIds] = useState([]);

  // 1. Load Programs and Master Catalogs
  useEffect(() => {
    let active = true;

    async function loadMasterData() {
      setLoadingCatalog(true);

      try {
        const [progRes, skillsRes, jobsRes] = await Promise.allSettled([
          API.getAllPrograms(),
          API.getallSkillSet(),
          API.getAllJobSkills(),
        ]);

        if (!active) return;

        const pList =
          progRes.status === "fulfilled"
            ? extractArray(progRes.value, ["programs"])
            : [];

        const sList =
          skillsRes.status === "fulfilled"
            ? extractArray(skillsRes.value, ["skillSets", "skills"])
            : [];

        const jList =
          jobsRes.status === "fulfilled"
            ? extractArray(jobsRes.value, [
                "jobTitles",
                "job_titles",
                "jobs",
              ])
            : [];

        if (skillsRes.status === "rejected") {
          console.error("Failed to load skills:", skillsRes.reason);
        }

        if (jobsRes.status === "rejected") {
          console.error("Failed to load job titles:", jobsRes.reason);
        }

        const finalPrograms =
          pList.length > 0 ? pList : FALLBACK_PROGRAMS;

        setPrograms(finalPrograms);
        setAllSkills(sList);
        setAllJobs(jList);

        if (!selectedProgramId && finalPrograms.length > 0) {
          setSelectedProgramId(String(finalPrograms[0].program_id));
        }

        console.log("Program Mapping Catalog:", {
          programs: finalPrograms.length,
          skills: sList.length,
          jobs: jList.length,
        });
      } catch (error) {
        console.error("Error loading master data:", error);
      } finally {
        if (active) {
          setLoadingCatalog(false);
          setRefreshing(false);
        }
      }
    }

    loadMasterData();

    return () => {
      active = false;
    };
  }, [catalogVersion]);

  // 2. Load linked data whenever selected program changes
  useEffect(() => {
    if (!selectedProgramId) return;

    let active = true;

    async function loadProgramLinks() {
      setLoadingLinked(true);

      try {
        const overrides = readLocalOverrides()[selectedProgramId];

        const [pSkills, pJobs] = await Promise.allSettled([
          API.getProgramSkills(selectedProgramId),
          API.getProgramJobTitles(selectedProgramId),
        ]);

        if (!active) return;

        const apiSkills =
          pSkills.status === "fulfilled"
            ? extractArray(pSkills.value, ["skills", "skillSets"])
            : [];

        const apiJobs =
          pJobs.status === "fulfilled"
            ? extractArray(pJobs.value, [
                "jobTitles",
                "job_titles",
                "jobs",
              ])
            : [];

        const skillIds = overrides?.skills
          ? overrides.skills
          : apiSkills.map((s) => s.skill_set_id);

        const jobIds = overrides?.jobs
          ? overrides.jobs
          : apiJobs.map((j) => j.job_title_id);

        // Include linked items missing from master catalogs
        setAllSkills((prev) => {
          const existing = new Set(
            prev.map((x) => String(x.skill_set_id))
          );

          const extra = apiSkills.filter(
            (x) => !existing.has(String(x.skill_set_id))
          );

          return extra.length > 0 ? [...prev, ...extra] : prev;
        });

        setAllJobs((prev) => {
          const existing = new Set(
            prev.map((x) => String(x.job_title_id))
          );

          const extra = apiJobs.filter(
            (x) => !existing.has(String(x.job_title_id))
          );

          return extra.length > 0 ? [...prev, ...extra] : prev;
        });

        setLinkedSkillIds(skillIds);
        setLinkedJobIds(jobIds);
      } catch (error) {
        console.error("Error loading program mappings:", error);
      } finally {
        if (active) setLoadingLinked(false);
      }
    }

    loadProgramLinks();

    return () => {
      active = false;
    };
  }, [selectedProgramId]);

  // 3. Refresh master catalog
  const handleRefreshCatalog = () => {
    setRefreshing(true);
    setCatalogVersion((prev) => prev + 1);
  };

  // 4. Save local mapping overrides
  const saveOverride = (type, nextIds) => {
    const all = readLocalOverrides();

    const current = all[selectedProgramId] || {
      skills: linkedSkillIds,
      jobs: linkedJobIds,
    };

    all[selectedProgramId] = {
      ...current,
      [type]: nextIds,
    };

    try {
      localStorage.setItem(LOCAL_MAPPINGS_KEY, JSON.stringify(all));
    } catch {
      console.error("Unable to save mapping overrides.");
    }
  };

  // 5. Toggle assignments
  const toggleAssignment = (type, id) => {
    if (type === "skills") {
      const next = linkedSkillIds.some((x) => String(x) === String(id))
        ? linkedSkillIds.filter((x) => String(x) !== String(id))
        : [...linkedSkillIds, id];

      setLinkedSkillIds(next);
      saveOverride("skills", next);
    } else {
      const next = linkedJobIds.some((x) => String(x) === String(id))
        ? linkedJobIds.filter((x) => String(x) !== String(id))
        : [...linkedJobIds, id];

      setLinkedJobIds(next);
      saveOverride("jobs", next);
    }
  };

  // 6. Reset local overrides and reload backend mappings
  const handleResetProgramOverride = () => {
    if (!selectedProgramId) return;

    const all = readLocalOverrides();

    delete all[selectedProgramId];

    try {
      localStorage.setItem(LOCAL_MAPPINGS_KEY, JSON.stringify(all));
    } catch {
      console.error("Unable to reset mapping overrides.");
    }

    // Reload the selected program
    setSelectedProgramId("");
    setTimeout(() => {
      setSelectedProgramId(String(selectedProgramId));
    }, 0);
  };

  const query = search.toLowerCase().trim();

  const tabConfig = {
    skills: {
      items: allSkills.filter((s) =>
        (s.skill_set_name || "").toLowerCase().includes(query)
      ),
      linkedIds: linkedSkillIds,
      idKey: "skill_set_id",
      nameKey: "skill_set_name",
      empty: "No skills found. Try refreshing the catalog.",
    },

    jobs: {
      items: allJobs.filter((j) =>
        (j.job_title_name || j.title || "").toLowerCase().includes(query)
      ),
      linkedIds: linkedJobIds,
      idKey: "job_title_id",
      nameKey: "job_title_name",
      empty: "No job titles found.",
    },
  };

  const activeData = tabConfig[activeTab];

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Admin • Curriculum & Career Mapping
          </p>

          <h1 className="mt-1 text-3xl font-bold text-ink">
            Program Mappings
          </h1>

          <p className="mt-1 text-sm text-muted">
            Inspect and toggle skills and target job titles linked to each
            academic program.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            disabled={refreshing || loadingCatalog}
            onClick={handleRefreshCatalog}
          >
            {refreshing ? "Refreshing..." : "Refresh Catalog"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetProgramOverride}
            disabled={!selectedProgramId}
          >
            Sync with Backend
          </Button>
        </div>
      </div>

      {/* Program Selector */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <GitBranch className="h-4 w-4 text-primary" />
          Select Academic Program
        </label>

        {loadingCatalog ? (
          <p className="text-sm text-muted">Loading programs...</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {programs.map((program) => {
              const idStr = String(program.program_id);
              const isSelected = selectedProgramId === idStr;

              return (
                <button
                  key={idStr}
                  type="button"
                  onClick={() => setSelectedProgramId(idStr)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isSelected
                      ? "border-transparent bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] text-white shadow-sm"
                      : "border-border bg-surface-alt/50 text-ink hover:border-primary"
                  }`}
                >
                  {program.program_code
                    ? `${program.program_code} — `
                    : ""}
                  {program.program_name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mapping Tabs */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 rounded-xl bg-surface-alt p-1">
            {[
              {
                key: "skills",
                label: "Skills",
                count: linkedSkillIds.length,
                icon: Sparkles,
              },
              {
                key: "jobs",
                label: "Job Titles",
                count: linkedJobIds.length,
                icon: Briefcase,
              },
            ].map(({ key, label, count, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setSearch("");
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  activeTab === key
                    ? "bg-surface text-primary shadow-soft"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}

                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex h-10 w-full items-center rounded-xl border border-border bg-surface-alt/50 px-3 md:w-72">
            <Search className="mr-2 h-4 w-4 text-muted" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Filter ${activeTab}...`}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <p className="mb-4 text-xs text-muted">
          Click any item below to assign or unassign it from the selected
          program. Highlighted chips are currently linked.
        </p>

        {loadingLinked || loadingCatalog ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">Loading program mappings...</span>
          </div>
        ) : activeData.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            {activeData.empty}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {activeData.items.map((item) => {
              const id = item[activeData.idKey];
              const name =
                item[activeData.nameKey] || item.title || "Untitled";

              const isLinked = activeData.linkedIds.some(
                (linkedId) => String(linkedId) === String(id)
              );

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAssignment(activeTab, id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    isLinked
                      ? "border-transparent bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] text-white shadow-xs"
                      : "border-border bg-surface-alt/40 text-ink hover:border-primary"
                  }`}
                >
                  {isLinked && <Check className="h-3.5 w-3.5" />}
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
