import { useEffect, useState } from "react";
import { Search, Plus, Trash2, Pencil, Heart } from "lucide-react";
import { API } from "@/api/api.js";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const LOCAL_INTERESTS_KEY = "skillsync_admin_custom_interests";

const FALLBACK_INTERESTS = [
  { interest_id: 1, interest_name: "Web Development" },
  { interest_id: 2, interest_name: "Mobile App Development" },
  { interest_id: 3, interest_name: "Artificial Intelligence & ML" },
  { interest_id: 4, interest_name: "Data Science & Analytics" },
  { interest_id: 5, interest_name: "Cybersecurity" },
  { interest_id: 6, interest_name: "Cloud Computing & DevOps" },
  { interest_id: 7, interest_name: "UI/UX Design" },
  { interest_id: 8, interest_name: "Game Development" },
  { interest_id: 9, interest_name: "Database Administration" },
  { interest_id: 10, interest_name: "Quality Assurance & Testing" },
];

export default function AdminInterestsPage() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newInterestName, setNewInterestName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInterests() {
      setLoading(true);
      let base = [];

      try {
        const res = await API.getAllInterests();
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          base = data;
        }
      } catch {
        // fallback below
      }

      if (base.length === 0) {
        base = FALLBACK_INTERESTS;
      }

      try {
        const stored = JSON.parse(
          localStorage.getItem(LOCAL_INTERESTS_KEY) || "null"
        );
        if (Array.isArray(stored) && stored.length > 0) {
          base = stored;
        }
      } catch {
        // ignore parse errors
      }

      if (active) {
        setInterests(base);
        setLoading(false);
      }
    }

    loadInterests();
    return () => {
      active = false;
    };
  }, []);

  const persistInterests = (nextList) => {
    setInterests(nextList);
    try {
      localStorage.setItem(LOCAL_INTERESTS_KEY, JSON.stringify(nextList));
    } catch {
      // ignore storage errors
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    const trimmed = newInterestName.trim();
    if (!trimmed) return;

    let createdItem = {
      interest_id: Date.now(),
      interest_name: trimmed,
    };

    try {
      const res = await API.createInterestAPI({ interest_name: trimmed });
      const returned = res.data?.data || res.data;
      if (returned?.interest_id) {
        createdItem = returned;
      }
      setStatusMessage("Interest added and synced.");
    } catch {
      setStatusMessage("Interest added locally (frontend workspace).");
    }

    persistInterests([createdItem, ...interests]);
    setNewInterestName("");
  };

  const startEdit = (item) => {
    setEditingId(item.interest_id);
    setEditingName(item.interest_name || "");
  };

  const handleSaveEdit = (interestId) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    const updated = interests.map((item) =>
      item.interest_id === interestId
        ? { ...item, interest_name: trimmed }
        : item
    );
    persistInterests(updated);
    setEditingId(null);
    setEditingName("");
    setStatusMessage("Interest updated.");
  };

  const handleDeleteInterest = (interestId) => {
    persistInterests(
      interests.filter((item) => item.interest_id !== interestId)
    );
    setStatusMessage("Interest removed.");
  };

  const query = search.toLowerCase().trim();
  const filtered = interests.filter((item) =>
    (item.interest_name || "").toLowerCase().includes(query)
  );

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • Interests Directory
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Manage Interests</h1>
        <p className="mt-1 text-sm text-muted">
          Add, rename, or remove student career interest tags shown during onboarding.
        </p>
      </div>

      {/* Add Form */}
      <form
        onSubmit={handleAddInterest}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Input
            label="New Interest Topic"
            placeholder="e.g., Robotics, FinTech, Cloud Architecture"
            value={newInterestName}
            onChange={(e) => setNewInterestName(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" icon={Plus}>
          Add Interest
        </Button>
      </form>

      {statusMessage && (
        <p className="text-xs font-medium text-primary">{statusMessage}</p>
      )}

      {/* Search */}
      <div className="flex h-12 items-center rounded-xl border border-border bg-surface px-4">
        <Search className="mr-3 h-4 w-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search interests..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      {/* List */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-ink">
            Interests ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-muted">Loading interests...</p>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-sm text-muted">
            No interests match your search.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((item) => {
              const isEditing = editingId === item.interest_id;
              return (
                <div
                  key={item.interest_id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full max-w-sm rounded-lg border border-border bg-surface-alt px-3 py-1.5 text-sm text-ink outline-none focus:border-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => handleSaveEdit(item.interest_id)}
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
                    <span className="text-sm font-semibold text-ink">
                      {item.interest_name}
                    </span>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg p-2 text-muted transition hover:bg-surface-alt hover:text-ink"
                        title="Edit interest"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInterest(item.interest_id)}
                        className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                        title="Delete interest"
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