import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import logo from "../assets/logos/logo.png";

const quickMobileItems = [
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <AdminSidebar
        isMobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar for Mobile & Split-Screen */}
        <header className="sticky top-0 z-30 border-b border-border bg-surface lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open admin navigation"
                className="rounded-xl border border-border bg-surface-alt p-2 text-ink transition hover:border-primary hover:text-primary"
              >
                <Menu className="h-5 w-5" />
              </button>
              <img
                src={logo}
                alt="SkillSyncAI"
                className="h-8 w-auto object-contain"
              />
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </span>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto border-t border-border/60 bg-surface-alt/50 px-4 py-2">
            {quickMobileItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-ink/70 hover:bg-surface hover:text-ink"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}