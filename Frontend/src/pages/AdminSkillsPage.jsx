
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { API } from "@/api/api.js";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const ITEMS_PER_PAGE = 10;

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [newSkillName, setNewSkillName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // GET ALL SKILLS
  const loadSkills = async () => {
    try {
      setLoading(true);

      const res = await API.getallSkillSet();
      const responseData = res.data?.data ?? res.data;

      const skillList =
        responseData?.skillSets ??
        responseData?.data?.skillSets ??
        responseData?.skills ??
        [];

      if (!Array.isArray(skillList)) {
        throw new Error("Invalid skills response from server.");
      }

      setSkills(skillList);
    } catch (error) {
      console.error("Error loading skills:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load skills. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // ADD SKILL
  const handleAddSkill = async (e) => {
    e.preventDefault();

    const trimmed = newSkillName.trim();

    if (!trimmed) {
      setMessage({
        type: "error",
        text: "Please enter a skill name.",
      });
      return;
    }

    const duplicate = skills.some(
      (skill) =>
        skill.skill_set_name.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicate) {
      setMessage({
        type: "error",
        text: "This skill already exists.",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await API.createSkillSet({
        skill_set_name: trimmed,
      });

      setNewSkillName("");
      setCurrentPage(1);

      await loadSkills();

      setMessage({
        type: "success",
        text: "Skill added successfully!",
      });
    } catch (error) {
      console.error("Error creating skill:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to add skill. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // START RENAMING
  const startEdit = (skill) => {
    setEditingId(skill.skill_set_id);
    setEditingName(skill.skill_set_name || "");
    setMessage({ type: "", text: "" });
  };

  // CANCEL RENAMING
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // SAVE RENAMED SKILL
  const handleSaveEdit = async (skillId) => {
    const trimmed = editingName.trim();

    if (!trimmed) {
      setMessage({
        type: "error",
        text: "Skill name cannot be empty.",
      });
      return;
    }

    const duplicate = skills.some(
      (skill) =>
        skill.skill_set_id !== skillId &&
        skill.skill_set_name.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicate) {
      setMessage({
        type: "error",
        text: "Another skill already uses this name.",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await API.renameSkillSet(skillId, {
        skill_set_name: trimmed,
      });

      cancelEdit();

      await loadSkills();

      setMessage({
        type: "success",
        text: "Skill renamed successfully!",
      });
    } catch (error) {
      console.error("Error renaming skill:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to rename skill. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // SEARCH
  const query = search.toLowerCase().trim();

  const filteredSkills = skills.filter((skill) =>
    (skill.skill_set_name || "").toLowerCase().includes(query)
  );

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSkills.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedSkills = filteredSkills.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    cancelEdit();
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // KEEP PAGE VALID AFTER DATA CHANGES
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="w-full min-w-0 space-y-6 p-4 sm:p-6">

      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Skills Directory
        </p>

        <h1 className="mt-1 text-3xl font-bold text-ink">
          All Skills
        </h1>

        <p className="mt-1 text-sm text-muted">
          Manage your skills database. Add new skills or rename existing entries.
        </p>
      </div>

      {/* NOTIFICATIONS */}
      {message.text && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ADD SKILL */}
      <form
        onSubmit={handleAddSkill}
        className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5"
      >
        <Input
          label="New Skill Name"
          placeholder="e.g., TypeScript, Docker, Python"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          disabled={saving}
        />

        <Button
          type="submit"
          variant="primary"
          icon={Plus}
          className="w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add Skill"}
        </Button>
      </form>

      {/* SEARCH */}
      <div className="flex h-12 min-w-0 items-center rounded-xl border border-border bg-surface px-3 sm:px-4">
        <Search className="mr-3 h-4 w-4 shrink-0 text-muted" />

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search skills..."
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />

        <button
          type="button"
          onClick={loadSkills}
          disabled={loading}
          title="Refresh skills"
          className="ml-2 shrink-0 rounded-lg p-2 text-muted transition hover:bg-surface-alt hover:text-ink disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* SKILLS LIST */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-6">

        {/* LIST HEADER */}
        <div className="mb-4 flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />

            <h2 className="truncate text-base font-bold text-ink">
              Skills ({filteredSkills.length})
            </h2>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="py-6 text-sm text-muted">
            Loading skills...
          </p>
        ) : filteredSkills.length === 0 ? (
          <p className="py-6 text-sm text-muted">
            {skills.length === 0
              ? "No skills found in the database."
              : "No skills match your search."}
          </p>
        ) : (
          <>
            {/* SKILL ITEMS */}
            <div className="divide-y divide-border">
              {paginatedSkills.map((skill) => {
                const isEditing = editingId === skill.skill_set_id;

                return (
                  <div
                    key={skill.skill_set_id}
                    className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-3"
                  >
                    {isEditing ? (
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(skill.skill_set_id);
                            }

                            if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          disabled={saving}
                          className="w-full min-w-0 max-w-xs rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                        />

                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          disabled={saving}
                          onClick={() => handleSaveEdit(skill.skill_set_id)}
                        >
                          {saving ? "Saving..." : "Save"}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={saving}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex min-w-0 flex-col">
                        <span className="break-words text-sm font-semibold text-ink">
                          {skill.skill_set_name}
                        </span>

                        <span className="text-xs text-muted">
                          Skill ID: {skill.skill_set_id}
                        </span>
                      </div>
                    )}

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(skill)}
                        title="Rename skill"
                        className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-surface-alt hover:text-ink"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">

              {/* RESULTS COUNT */}
              <p className="text-center text-xs text-muted sm:text-left">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {startIndex + 1}
                </span>
                {" - "}
                <span className="font-semibold text-ink">
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    filteredSkills.length
                  )}
                </span>
                {" of "}
                <span className="font-semibold text-ink">
                  {filteredSkills.length}
                </span>
                {" skills"}
              </p>

              {/* PAGE CONTROLS */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={previousPage}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <span className="whitespace-nowrap text-sm text-muted">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={nextPage}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
