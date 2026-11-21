import { useEffect, useState } from "react";
import { Search, Plus, Trash2, Pencil, Sparkles } from "lucide-react";
import { API } from "@/api/api.js";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const LOCAL_SKILLS_KEY = "skillsync_admin_custom_skills";

const FALLBACK_SKILLS = [
  { skill_set_id: 101, skill_set_name: "JavaScript", category: "Programming" },
  { skill_set_id: 102, skill_set_name: "React", category: "Frontend" },
  { skill_set_id: 103, skill_set_name: "Node.js", category: "Backend" },
  { skill_set_id: 104, skill_set_name: "SQL & Databases", category: "Data" },
  { skill_set_id: 105, skill_set_name: "UI/UX Principles", category: "Design" },
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSkills() {
      setLoading(true);
      let baseSkills = [];

      try {
        const res = await API.getallSkillSet();
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          baseSkills = data;
        }
      } catch {
        // fallback below
      }

      if (baseSkills.length === 0) {
        baseSkills = FALLBACK_SKILLS;
      }

      try {
        const stored = JSON.parse(localStorage.getItem(LOCAL_SKILLS_KEY) || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          const ids = new Set(baseSkills.map((s) => s.skill_set_id));
          baseSkills = [
            ...stored.filter((s) => !ids.has(s.skill_set_id)),
            ...baseSkills,
          ];
        }
      } catch {
        // ignore parse error
      }

      if (active) {
        setSkills(baseSkills);
        setLoading(false);
      }
    }

    loadSkills();
    return () => {
      active = false;
    };
  }, []);

  const persistLocalSkills = (nextList) => {
    setSkills(nextList);
    try {
      localStorage.setItem(LOCAL_SKILLS_KEY, JSON.stringify(nextList));
    } catch {
      // ignore storage error
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    const created = {
      skill_set_id: Date.now(),
      skill_set_name: trimmed,
      category: newSkillCategory.trim() || "General",
    };

    persistLocalSkills([created, ...skills]);
    setNewSkillName("");
  };

  const startEdit = (skill) => {
    setEditingId(skill.skill_set_id);
    setEditingName(skill.skill_set_name || "");
  };

  const handleSaveEdit = (skillId) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    const updated = skills.map((item) =>
      item.skill_set_id === skillId
        ? { ...item, skill_set_name: trimmed }
        : item
    );
    persistLocalSkills(updated);
    setEditingId(null);
    setEditingName("");
  };

  const handleDeleteSkill = (skillId) => {
    persistLocalSkills(skills.filter((item) => item.skill_set_id !== skillId));
  };

  const query = search.toLowerCase().trim();
  const filteredSkills = skills.filter((skill) =>
    (skill.skill_set_name || "").toLowerCase().includes(query)
  );

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Skills Directory
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">All Skills</h1>
        <p className="mt-1 text-sm text-muted">
          View available skills or add/edit entries in your frontend workspace.
        </p>
      </div>

      {/* Add Skill Bar */}
      <form
        onSubmit={handleAddSkill}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:grid-cols-3 sm:items-end"
      >
        <Input
          label="New Skill Name"
          placeholder="e.g., TypeScript, Docker"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
        />
        <Input
          label="Category"
          placeholder="e.g., Programming, Cloud"
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value)}
        />
        <Button type="submit" variant="primary" icon={Plus} className="w-full">
          Add Skill
        </Button>
      </form>

      {/* Search */}
      <div className="flex h-12 items-center rounded-xl border border-border bg-surface px-4">
        <Search className="mr-3 h-4 w-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      {/* Skills List */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Skills ({filteredSkills.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-muted">Loading skills...</p>
        ) : filteredSkills.length === 0 ? (
          <p className="py-6 text-sm text-muted">No skills match your search.</p>
        ) : (
          <div className="divide-y divide-border">
            {filteredSkills.map((skill) => {
              const isEditing = editingId === skill.skill_set_id;
              return (
                <div
                  key={skill.skill_set_id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full max-w-xs rounded-lg border border-border bg-surface-alt px-3 py-1.5 text-sm text-ink outline-none focus:border-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => handleSaveEdit(skill.skill_set_id)}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-ink">
                        {skill.skill_set_name}
                      </span>
                      {skill.category && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {skill.category}
                        </span>
                      )}
                    </div>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(skill)}
                        className="rounded-lg p-2 text-muted transition hover:bg-surface-alt hover:text-ink"
                        title="Edit skill"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill.skill_set_id)}
                        className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                        title="Remove skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}