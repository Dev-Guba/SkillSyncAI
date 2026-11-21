import { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

const LOCAL_USERS_KEY = "skillsync_admin_users";

const ROLE_OPTIONS = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Faculty" },
  { value: "3", label: "Student" },
];

const ROLE_META = {
  1: {
    name: "Admin",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    icon: ShieldCheck,
  },
  2: {
    name: "Faculty",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    icon: BookOpen,
  },
  3: {
    name: "Student",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: GraduationCap,
  },
};

const DEFAULT_USERS = [
  {
    user_id: 1,
    username: "admin",
    full_name: "System Administrator",
    email: "admin@skillsync.ai",
    role_id: 1,
    status: "Active",
    created_at: "2026-07-03",
  },
  {
    user_id: 2,
    username: "faculty1",
    full_name: "Faculty Member 1",
    email: "faculty1@skillsync.ai",
    role_id: 2,
    status: "Active",
    created_at: "2026-07-03",
  },
  {
    user_id: 3,
    username: "faculty2",
    full_name: "Faculty Member 2",
    email: "faculty2@skillsync.ai",
    role_id: 2,
    status: "Active",
    created_at: "2026-07-03",
  },
  {
    user_id: 4,
    username: "student1",
    full_name: "Student Account 1",
    email: "student1@skillsync.ai",
    role_id: 3,
    status: "Active",
    created_at: "2026-07-03",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formError, setFormError] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    full_name: "",
    email: "",
    role_id: "3",
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "null");
      if (Array.isArray(saved) && saved.length > 0) {
        setUsers(saved);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch {
      setUsers(DEFAULT_USERS);
    }
  }, []);

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(nextUsers));
    } catch {
      // ignore storage errors
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const username = newUser.username.trim();
    const fullName = newUser.full_name.trim();
    const email = newUser.email.trim();

    if (!username) {
      setFormError("Username is required.");
      return;
    }

    const exists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      setFormError("That username already exists.");
      return;
    }

    const created = {
      user_id: Date.now(),
      username,
      full_name: fullName || username,
      email: email || `${username}@skillsync.ai`,
      role_id: Number(newUser.role_id) || 3,
      status: "Active",
      created_at: new Date().toISOString().slice(0, 10),
    };

    persistUsers([created, ...users]);
    setNewUser({ username: "", full_name: "", email: "", role_id: "3" });
    setFormError("");
  };

  const handleRoleChange = (userId, nextRoleId) => {
    const updated = users.map((u) =>
      u.user_id === userId ? { ...u, role_id: Number(nextRoleId) } : u
    );
    persistUsers(updated);
  };

  const handleToggleStatus = (userId) => {
    const updated = users.map((u) =>
      u.user_id === userId
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    );
    persistUsers(updated);
  };

  const handleDeleteUser = (userId) => {
    persistUsers(users.filter((u) => u.user_id !== userId));
  };

  const query = search.toLowerCase().trim();
  const filteredUsers = users.filter((u) => {
    const matchesRole =
      roleFilter === "all" || Number(u.role_id) === Number(roleFilter);
    const matchesQuery =
      !query ||
      (u.username || "").toLowerCase().includes(query) ||
      (u.full_name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  const stats = [
    { label: "Total Accounts", count: users.length },
    {
      label: "Admins",
      count: users.filter((u) => Number(u.role_id) === 1).length,
    },
    {
      label: "Faculty",
      count: users.filter((u) => Number(u.role_id) === 2).length,
    },
    {
      label: "Students",
      count: users.filter((u) => Number(u.role_id) === 3).length,
    },
  ];

  return (
    <section className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Admin • User & Role Management
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Users & Roles</h1>
        <p className="mt-1 text-sm text-muted">
          Manage Admin, Faculty, and Student accounts locally while backend role endpoints are in progress.
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <p className="text-xs font-medium text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Create Account Form */}
      <form
        onSubmit={handleAddUser}
        className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-ink">Create New Account</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <Input
            label="Username"
            placeholder="e.g., faculty3"
            value={newUser.username}
            onChange={(e) => {
              setNewUser((p) => ({ ...p, username: e.target.value }));
              setFormError("");
            }}
          />
          <Input
            label="Full Name"
            placeholder="e.g., Prof. Juan Dela Cruz"
            value={newUser.full_name}
            onChange={(e) =>
              setNewUser((p) => ({ ...p, full_name: e.target.value }))
            }
          />
          <Input
            label="Email"
            type="email"
            placeholder="user@school.edu"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((p) => ({ ...p, email: e.target.value }))
            }
          />
          <Select
            label="Role"
            value={newUser.role_id}
            onChange={(e) =>
              setNewUser((p) => ({ ...p, role_id: e.target.value }))
            }
            options={ROLE_OPTIONS}
          />
          <Button
            type="submit"
            variant="primary"
            icon={UserPlus}
            className="w-full"
          >
            Add User
          </Button>
        </div>

        {formError && <p className="text-xs font-medium text-red-500">{formError}</p>}
      </form>

      {/* Search & Role Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-11 flex-1 items-center rounded-xl border border-border bg-surface px-4">
          <Search className="mr-3 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username, name, or email..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "1", label: "Admin" },
            { id: "2", label: "Faculty" },
            { id: "3", label: "Student" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                roleFilter === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border bg-surface text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-ink">
            Accounts ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="p-6 text-sm text-muted">No users match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-alt/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => {
                  const meta = ROLE_META[user.role_id] || ROLE_META[3];
                  const isPrimaryAdmin = user.username === "admin";
                  return (
                    <tr
                      key={user.user_id}
                      className="transition hover:bg-surface-alt/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-ink">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-muted">
                          @{user.username} • {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={String(user.role_id)}
                          disabled={isPrimaryAdmin}
                          onChange={(e) =>
                            handleRoleChange(user.user_id, e.target.value)
                          }
                          className={`rounded-lg border border-border px-2.5 py-1 text-xs font-semibold outline-none disabled:opacity-70 ${meta.badge}`}
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-surface text-ink"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={isPrimaryAdmin}
                          onClick={() => handleToggleStatus(user.user_id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {user.created_at}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={isPrimaryAdmin}
                          onClick={() => handleDeleteUser(user.user_id)}
                          title={
                            isPrimaryAdmin
                              ? "Primary admin cannot be removed"
                              : "Remove user"
                          }
                          className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}