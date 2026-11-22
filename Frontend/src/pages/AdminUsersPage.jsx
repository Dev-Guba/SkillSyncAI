
import { useEffect, useState } from "react";

import {
    Users,
    Search,
    UserPlus,
    ShieldCheck,
    GraduationCap,
} from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

import API from "../api/api.js";

// ROLE OPTIONS
const ROLE_OPTIONS = [
    { value: "1", label: "Admin" },
    { value: "3", label: "Student" },
];

// ROLE METADATA
const ROLE_META = {
    1: {
        name: "Admin",
        badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
        icon: ShieldCheck,
    },
    3: {
        name: "Student",
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
        icon: GraduationCap,
    },
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role_id: "3",
    });
    useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await API.getAllUsers();

            console.log("GET ALL USERS RESPONSE:", response.data);

            const data = response.data;

            // Support common API response structures
            const userList =
                data.users ||
                data.data?.users ||
                data.data ||
                [];

            if (Array.isArray(userList)) {
                setUsers(userList);
            } else {
                console.error("Invalid users response:", data);
                setFormError("Invalid response from server.");
            }

        } catch (error) {
            console.error(
                "FETCH USERS ERROR:",
                error.response?.data || error.message
            );

            setFormError(
                error.response?.data?.message ||
                "Unable to load user accounts."
            );
        }
    };

    fetchUsers();
}, []);

    // CREATE USER ACCOUNT
    const handleAddUser = async (e) => {
        e.preventDefault();

        const username = newUser.username.trim();
        const password = newUser.password;

        setFormError("");
        setSuccessMessage("");

        if (!username || !password) {
            setFormError("Username and password are required.");
            return;
        }

        if (username.length > 50) {
            setFormError("Username must not exceed 50 characters.");
            return;
        }

        if (password.length < 8) {
            setFormError("Password must be at least 8 characters.");
            return;
        }

        if (!["1", "3"].includes(newUser.role_id)) {
            setFormError("Invalid account role.");
            return;
        }

        setIsCreating(true);

        try {
            const response = await API.register({
                username,
                password,
                role_id: Number(newUser.role_id),
            });

            if (response.data.success) {
                const createdUser = response.data.user;

                setUsers((prev) => [
                    {
                        ...createdUser,
                        role_id: Number(createdUser.role_id),
                    },
                    ...prev,
                ]);

                setNewUser({
                    username: "",
                    password: "",
                    role_id: "3",
                });

                setSuccessMessage(
                    "User account created successfully!"
                );
            }

        } catch (error) {
            console.error("Create user error:", error);

            setFormError(
                error.response?.data?.message ||
                "Failed to create user account. Please try again."
            );

        } finally {
            setIsCreating(false);
        }
    };

    // SEARCH AND FILTER USERS
    const query = search.toLowerCase().trim();

    const filteredUsers = users.filter((user) => {
        const matchesRole =
            roleFilter === "all" ||
            Number(user.role_id) === Number(roleFilter);

        const matchesQuery =
            !query ||
            (user.username || "").toLowerCase().includes(query);

        return matchesRole && matchesQuery;
    });

    // USER STATISTICS
    const stats = [
        {
            label: "Total Accounts",
            count: users.length,
        },
        {
            label: "Admins",
            count: users.filter(
                (user) => Number(user.role_id) === 1
            ).length,
        },
        {
            label: "Students",
            count: users.filter(
                (user) => Number(user.role_id) === 3
            ).length,
        },
    ];

    return (
        <section className="space-y-6 p-6">

            {/* PAGE HEADER */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Admin • User Management
                </p>

                <h1 className="mt-1 text-3xl font-bold text-ink">
                    Users & Roles
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Create and manage Admin and Student accounts.
                </p>
            </div>

            {/* ROLE SUMMARY CARDS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {stats.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
                    >
                        <p className="text-xs font-medium text-muted">
                            {item.label}
                        </p>

                        <p className="mt-2 text-2xl font-extrabold text-ink">
                            {item.count}
                        </p>
                    </div>
                ))}

            </div>

            {/* CREATE ACCOUNT FORM */}
            <form
                onSubmit={handleAddUser}
                className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >

                <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />

                    <h2 className="text-sm font-bold text-ink">
                        Create New Account
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">

                    {/* USERNAME */}
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => {
                            setNewUser((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }));

                            setFormError("");
                            setSuccessMessage("");
                        }}
                    />

                    {/* PASSWORD */}
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) => {
                            setNewUser((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }));

                            setFormError("");
                            setSuccessMessage("");
                        }}
                    />

                    {/* ROLE */}
                    <Select
                        label="Role"
                        value={newUser.role_id}
                        onChange={(e) => {
                            setNewUser((prev) => ({
                                ...prev,
                                role_id: e.target.value,
                            }));
                        }}
                        options={ROLE_OPTIONS}
                    />

                    {/* SUBMIT BUTTON */}
                    <Button
                        type="submit"
                        variant="primary"
                        icon={UserPlus}
                        className="w-full"
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating..." : "Add User"}
                    </Button>

                </div>

                {/* FEEDBACK MESSAGES */}
                {formError && (
                    <p className="text-xs font-medium text-red-500">
                        {formError}
                    </p>
                )}

                {successMessage && (
                    <p className="text-xs font-medium text-green-600">
                        {successMessage}
                    </p>
                )}

            </form>

            {/* SEARCH AND ROLE FILTER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* SEARCH */}
                <div className="flex h-11 flex-1 items-center rounded-xl border border-border bg-surface px-4">

                    <Search className="mr-3 h-4 w-4 text-muted" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by username..."
                        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                    />

                </div>

                {/* ROLE FILTER */}
                <div className="flex flex-wrap gap-2">

                    {[
                        { id: "all", label: "All" },
                        { id: "1", label: "Admin" },
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

            {/* USERS TABLE */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">

                <div className="flex items-center gap-2 border-b border-border px-6 py-4">

                    <Users className="h-4 w-4 text-primary" />

                    <h2 className="text-base font-bold text-ink">
                        Accounts ({filteredUsers.length})
                    </h2>

                </div>

                {filteredUsers.length === 0 ? (

                    <p className="p-6 text-sm text-muted">
                        No users found.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="border-b border-border bg-surface-alt/60 text-xs uppercase tracking-wider text-muted">

                                <tr>
                                    <th className="px-6 py-3.5">
                                        Username
                                    </th>

                                    <th className="px-6 py-3.5">
                                        User ID
                                    </th>

                                    <th className="px-6 py-3.5">
                                        Role
                                    </th>

                                    <th className="px-6 py-3.5">
                                        Created
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-border">

                                {filteredUsers.map((user) => {

                                    const meta =
                                        ROLE_META[user.role_id] ||
                                        ROLE_META[3];

                                    const RoleIcon = meta.icon;

                                    return (
                                        <tr
                                            key={user.user_id}
                                            className="transition hover:bg-surface-alt/40"
                                        >

                                            {/* USERNAME */}
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-ink">
                                                    {user.username}
                                                </p>
                                            </td>

                                            {/* USER ID */}
                                            <td className="px-6 py-4 text-xs text-muted">
                                                #{user.user_id}
                                            </td>

                                            {/* ROLE */}
                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
                                                >
                                                    <RoleIcon className="h-3.5 w-3.5" />

                                                    {meta.name}
                                                </span>

                                            </td>

                                            {/* CREATED DATE */}
                                            <td className="px-6 py-4 text-xs text-muted">
                                                {user.created_at
                                                    ? new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()
                                                    : "—"}
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
