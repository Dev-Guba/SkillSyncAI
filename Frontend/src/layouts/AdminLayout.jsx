import { Outlet, NavLink } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const mobileItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/interests", label: "Interests" },
  { to: "/admin/mappings", label: "Mappings" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/analytics", label: "Trends" },
  { to: "/admin/catalog", label: "Catalog" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        {/* Mobile Admin Nav */}
        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-surface-alt px-4 py-3 sm:hidden">
          {mobileItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center rounded-xl px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-primary text-white" : "text-ink/70"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}