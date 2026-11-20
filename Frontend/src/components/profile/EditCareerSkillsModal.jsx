import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Search,
  Check,
  Sparkles,
  Sliders,
  Briefcase,
  Loader2,
} from "lucide-react";
import Button from "@/components/common/Button";
import { API } from "@/api/api";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function EditCareerSkillsModal({
  isOpen,
  initialTab = "skills", // "skills" | "job"
  currentSkills = [],
  currentJobTitle = null,
  onClose,
  onSaveSkills,
  onSaveJobTitle,
  isSaving,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  // Available options from backend
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // User selections inside modal
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearch("");

      const normalizedSkills = (currentSkills || []).map((s) => ({
        ...s,
        proficiency_level:
          s.proficiency_level || s.UserSkill?.proficiency_level || "Beginner",
      }));
      setSelectedSkills(normalizedSkills);
      setSelectedJob(currentJobTitle || null);

      loadCatalogData(normalizedSkills);
    }
  }, [isOpen, initialTab, currentSkills, currentJobTitle]);

  const loadCatalogData = async (userSkillsList) => {
    setLoadingOptions(true);
    try {
      const programId = localStorage.getItem("selectedProgram");

      // 1. Load Skills (try program skills first, then all skillsets)
      let loadedSkills = [];
      if (programId) {
        try {
          const res = await API.getProgramSkills(programId);
          loadedSkills = res.data?.data || [];
        } catch {
          // fallback below
        }
      }
      if (loadedSkills.length === 0) {
        try {
          const res = await API.getallSkillSet();
          loadedSkills = res.data?.data || res.data || [];
        } catch {
          loadedSkills = userSkillsList;
        }
      }
      setAvailableSkills(Array.isArray(loadedSkills) ? loadedSkills : []);

      // 2. Load Job Titles (try program job titles, then all job titles)
      let loadedJobs = [];
      if (programId) {
        try {
          const res = await API.getProgramJobTitles(programId);
          loadedJobs = res.data?.data || [];
        } catch {
          // fallback below
        }
      }
      if (loadedJobs.length === 0) {
        try {
          const res = await API.getAllJobSkills();
          loadedJobs = res.data?.data || res.data || [];
        } catch {
          loadedJobs = [];
        }
      }
      setAvailableJobTitles(Array.isArray(loadedJobs) ? loadedJobs : []);
    } catch (err) {
      console.error("Failed to load skills/job titles:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    const exists = selectedSkills.some(
      (item) => item.skill_set_id === skill.skill_set_id
    );
    if (exists) {
      setSelectedSkills((prev) =>
        prev.filter((item) => item.skill_set_id !== skill.skill_set_id)
      );
    } else {
      setSelectedSkills((prev) => [
        ...prev,
        { ...skill, proficiency_level: "Beginner" },
      ]);
    }
  };

  const updateSkillProficiency = (skillSetId, level) => {
    setSelectedSkills((prev) =>
      prev.map((skill) =>
        skill.skill_set_id === skillSetId
          ? { ...skill, proficiency_level: level }
          : skill
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (activeTab === "skills") {
      const ok = await onSaveSkills(selectedSkills);
      if (ok) onClose();
    } else {
      if (!selectedJob) return;
      const ok = await onSaveJobTitle(selectedJob);
      if (ok) onClose();
    }
  };

  const query = search.toLowerCase().trim();

  const filteredSkills = availableSkills.filter((s) =>
    (s.skill_set_name || "").toLowerCase().includes(query)
  );

  const filteredJobs = availableJobTitles.filter((j) =>
    (j.job_title_name || j.title || "").toLowerCase().includes(query)
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-soft-lg sm:p-8"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              {activeTab === "skills"
                ? "Edit Skills & Proficiency"
                : "Edit Target Job Title"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="mb-6 flex rounded-xl bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("skills");
                setSearch("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "skills"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Skills ({selectedSkills.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("job");
                setSearch("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "job"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Job Title
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-5 flex h-11 items-center rounded-xl border border-border bg-surface-alt/50 px-3.5">
            <Search className="mr-2.5 h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === "skills"
                  ? "Search skills..."
                  : "Search job titles..."
              }
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>

          {loadingOptions ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm">Loading options...</span>
            </div>
          ) : activeTab === "skills" ? (
            <div className="space-y-6">
              {/* Skill Chips */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                  Select or deselect skills
                </p>
                {filteredSkills.length === 0 ? (
                  <p className="text-sm text-muted">No matching skills found.</p>
                ) : (
                  <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                    {filteredSkills.map((skill) => {
                      const isSelected = selectedSkills.some(
                        (s) => s.skill_set_id === skill.skill_set_id
                      );
                      return (
                        <button
                          key={skill.skill_set_id}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            isSelected
                              ? "border-transparent bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF] text-white"
                              : "border-border text-ink hover:border-primary"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {skill.skill_set_name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Proficiency Selector */}
              {selectedSkills.length > 0 && (
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-ink">
                      Skill Proficiency
                    </h3>
                  </div>

                  <div className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill.skill_set_id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                      >
                        <span className="text-xs font-medium text-ink">
                          {skill.skill_set_name}
                        </span>
                        <div className="flex gap-1">
                          {PROFICIENCY_LEVELS.map((level) => {
                            const active =
                              (skill.proficiency_level || "Beginner") === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() =>
                                  updateSkillProficiency(
                                    skill.skill_set_id,
                                    level
                                  )
                                }
                                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                                  active
                                    ? "bg-primary text-white"
                                    : "border border-border text-muted hover:border-primary hover:text-ink"
                                }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Job Title Selection */
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredJobs.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  No job titles found.
                </p>
              ) : (
                filteredJobs.map((job) => {
                  const jobId = job.job_title_id;
                  const jobName = job.job_title_name || job.title;
                  const isSelected = selectedJob?.job_title_id === jobId;

                  return (
                    <button
                      key={jobId}
                      type="button"
                      onClick={() =>
                        setSelectedJob({
                          job_title_id: jobId,
                          job_title_name: jobName,
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface-alt text-muted"
                          }`}
                        >
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-ink">
                          {jobName}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={
                isSaving ||
                (activeTab === "skills" && selectedSkills.length === 0) ||
                (activeTab === "job" && !selectedJob)
              }
            >
              {isSaving
                ? "Saving..."
                : activeTab === "skills"
                ? "Save Skills"
                : "Save Job Title"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}