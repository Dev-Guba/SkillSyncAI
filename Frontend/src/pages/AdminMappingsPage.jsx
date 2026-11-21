import { useEffect, useState } from "react";
import {
  GitBranch,
  Sparkles,
  Heart,
  Briefcase,
  Search,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { API } from "@/api/api.js";
import Button from "@/components/common/Button";

const LOCAL_MAPPINGS_KEY = "skillsync_admin_program_mappings";

const FALLBACK_PROGRAMS = [
  { program_id: 1, program_code: "BSCS", program_name: "BS Computer Science" },
  { program_id: 2, program_code: "BSIT", program_name: "BS Information Technology" },
];

const FALLBACK_INTERESTS = [
  { interest_id: 1, interest_name: "Web Development" },
  { interest_id: 2, interest_name: "Mobile App Development" },
  { interest_id: 3, interest_name: "Artificial Intelligence & ML" },
  { interest_id: 4, interest_name: "Data Science & Analytics" },
  { interest_id: 5, interest_name: "Cybersecurity" },
  { interest_id: 6, interest_name: "Cloud Computing & DevOps" },
  { interest_id: 7, interest_name: "UI/UX Design" },
];

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
  const [activeTab, setActiveTab] = useState("skills"); // skills | interests | jobs
  const [search, setSearch] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingLinked, setLoadingLinked] = useState(false);

  // Master lists
  const [allSkills, setAllSkills] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  // Linked IDs for the currently selected program
  const [linkedSkillIds, setLinkedSkillIds] = useState([]);
  const [linkedInterestIds, setLinkedInterestIds] = useState([]);
  const [linkedJobIds, setLinkedJobIds] = useState([]);

  // 1. Load Programs & Master Catalogs
  useEffect(() => {
    let active = true;

    async function loadMasterData() {
      setLoadingCatalog(true);
      const [progRes, skillsRes, intRes, jobsRes] = await Promise.allSettled([
        API.getAllPrograms(),
        API.getallSkillSet(),
        API.getAllInterests(),
        API.getAllJobSkills(),
      ]);

      if (!active) return;

      const pList =
        progRes.status === "fulfilled"
          ? progRes.value.data?.data || progRes.value.data || []
          : [];
      const finalPrograms =
        Array.isArray(pList) && pList.length > 0 ? pList : FALLBACK_PROGRAMS;

      const sList =
        skillsRes.status === "fulfilled"
          ? skillsRes.value.data?.data || skillsRes.value.data || []
          : [];
      const iList =
        intRes.status === "fulfilled"
          ? intRes.value.data?.data || intRes.value.data || []
          : [];
      const jList =
        jobsRes.status === "fulfilled"
          ? jobsRes.value.data?.data || jobsRes.value.data || []
          : [];

      setPrograms(finalPrograms);
      setAllSkills(Array.isArray(sList) ? sList : []);
      setAllInterests(
        Array.isArray(iList) && iList.length > 0 ? iList : FALLBACK_INTERESTS
      );
      setAllJobs(Array.isArray(jList) ? jList : []);

      if (finalPrograms.length > 0) {
        setSelectedProgramId(String(finalPrograms[0].program_id));
      }

      setLoadingCatalog(false);
    }

    loadMasterData();
    return () => {
      active = false;
    };
  }, []);

  // 2. Load Linked Data whenever selectedProgramId changes
  useEffect(() => {
    if (!selectedProgramId) return;
    let active = true;

    async function loadProgramLinks() {
      setLoadingLinked(true);
      const overrides = readLocalOverrides()[selectedProgramId];

      const [pSkills, pInterests, pJobs] = await Promise.allSettled([
        API.getProgramSkills(selectedProgramId),
        API.getProgramInterests(selectedProgramId),
        API.getProgramJobTitles(selectedProgramId),
      ]);

      if (!active) return;

      const apiSkills =
        pSkills.status === "fulfilled"
          ? pSkills.value.data?.data || pSkills.value.data || []
          : [];
      const apiInterests =
        pInterests.status === "fulfilled"
          ? pInterests.value.data?.data || pInterests.value.data || []
          : [];
      const apiJobs =
        pJobs.status === "fulfilled"
          ? pJobs.value.data?.data || pJobs.value.data || []
          : [];

      const skillIds = overrides?.skills
        ? overrides.skills
        : Array.isArray(apiSkills)
        ? apiSkills.map((s) => s.skill_set_id)
        : [];

      const interestIds = overrides?.interests
        ? overrides.interests
        : Array.isArray(apiInterests)
        ? apiInterests.map((i) => i.interest_id)
        : [];

      const jobIds = overrides?.jobs
        ? overrides.jobs
        : Array.isArray(apiJobs)
        ? apiJobs.map((j) => j.job_title_id)
        : [];

      // Also ensure any linked items not in master list appear cleanly
      if (Array.isArray(apiSkills) && apiSkills.length > 0) {
        setAllSkills((prev) => {
          const existing = new Set(prev.map((x) => x.skill_set_id));
          const extra = apiSkills.filter((x) => !existing.has(x.skill_set_id));
          return extra.length > 0 ? [...prev, ...extra] : prev;
        });
      }
      if (Array.isArray(apiJobs) && apiJobs.length > 0) {
        setAllJobs((prev) => {
          const existing = new Set(prev.map((x) => x.job_title_id));
          const extra = apiJobs.filter((x) => !existing.has(x.job_title_id));
          return extra.length > 0 ? [...prev, ...extra] : prev;
        });
      }

      setLinkedSkillIds(skillIds);
      setLinkedInterestIds(interestIds);
      setLinkedJobIds(jobIds);
      setLoadingLinked(false);
    }

    loadProgramLinks();
    return () => {
      active = false;
    };
  }, [selectedProgramId]);

  const saveOverride = (type, nextIds) => {
    const all = readLocalOverrides();
    const current = all[selectedProgramId] || {
      skills: linkedSkillIds,
      interests: linkedInterestIds,
      jobs: linkedJobIds,
    };

    all[selectedProgramId] = {
      ...current,
      [type]: nextIds,
    };

    try {
      localStorage.setItem(LOCAL_MAPPINGS_KEY, JSON.stringify(all));
    } catch {
      // ignore storage errors
    }
  };

  const toggleAssignment = (type, id) => {
    if (type === "skills") {
      const next = linkedSkillIds.includes(id)
        ? linkedSkillIds.filter((x) => x !== id)
        : [...linkedSkillIds, id];
      setLinkedSkillIds(next);
      saveOverride("skills", next);
    } else if (type === "interests") {
      const next = linkedInterestIds.includes(id)
        ? linkedInterestIds.filter((x) => x !== id)
        : [...linkedInterestIds, id];
      setLinkedInterestIds(next);
      saveOverride("interests", next);
    } else {
      const next = linkedJobIds.includes(id)
        ? linkedJobIds.filter((x) => x !== id)
        : [...linkedJobIds, id];
      setLinkedJobIds(next);
      saveOverride("jobs", next);
    }
  };

  const handleResetProgramOverride = () => {
    const all = readLocalOverrides();
    delete all[selectedProgramId];
    localStorage.setItem(LOCAL_MAPPINGS_KEY, JSON.stringify(all));
    // Trigger reload
    const current = selectedProgramId;
    setSelectedProgramId("");
    setTimeout(() => setSelectedProgramId(current), 0);
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
      empty: "No skills found.",
    },
    interests: {
      items: allInterests.filter((i) =>
        (i.interest_name || "").toLowerCase().includes(query)
      ),
      linkedIds: linkedInterestIds,
      idKey: "interest_id",
      nameKey: "interest_name",
      empty: "No interests found.",
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Admin • Curriculum & Career Mapping
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink">
            Program Mappings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Inspect and toggle skills, interests, and target job titles linked to each academic program.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={handleResetProgramOverride}
        >
          Sync with Backend
        </Button>
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
                  {program.program_code ? `${program.program_code} — ` : ""}
                  {program.program_name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mapping Tabs & Toggle Area */}
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
                key: "interests",
                label: "Interests",
                count: linkedInterestIds.length,
                icon: Heart,
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
          Click any item below to assign or unassign it from the selected program. Highlighted chips are currently linked.
        </p>

        {loadingLinked ? (
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
              const name = item[activeData.nameKey] || item.title || "Untitled";
              const isLinked = activeData.linkedIds.includes(id);

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