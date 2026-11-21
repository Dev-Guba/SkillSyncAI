import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Heart,
  GitBranch,
  Briefcase,
  BarChart3,
  GraduationCap,
  Settings,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logos/logo.png";
import { useAuth } from "@/context/AuthContext";

const adminNavItems = [
  {
    to: "/admin",
    label: "Admin Overview",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/users",
    label: "Users & Roles",
    icon: Users,
  },
  {
    to: "/admin/skills",
    label: "Manage Skills",
    icon: Sparkles,
  },
  {
    to: "/admin/interests",
    label: "Manage Interests",
    icon: Heart,
  },
  {
    to: "/admin/mappings",
    label: "Program Mappings",
    icon: GitBranch,
  },
  {
    to: "/admin/jobs",
    label: "Jobs & Importer",
    icon: Briefcase,
  },
  {
    to: "/admin/analytics",
    label: "Skill Trends",
    icon: BarChart3,
  },
  {
    to: "/admin/catalog",
    label: "Programs & Careers",
    icon: GraduationCap,
  },
  {
    to: "/admin/settings",
    label: "Admin Settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { setAdminMode, logout } = useAuth();

  const handleBackToUserDashboard = () => {
    setAdminMode?.(false);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setAdminMode?.(false);
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-surface sm:flex sm:flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="SkillSyncAI"
            className="h-10 w-auto max-w-[170px] object-contain"
          />
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Admin Console</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 pb-4">
        {adminNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `
              group flex items-center gap-3 rounded-xl px-4 py-2.5
              text-sm font-medium transition-colors duration-200

              ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink/70 hover:bg-primary/10 hover:text-primary"
              }
              `
            }
          >
            <Icon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105" />
            {label}
          </NavLink>
        ))}

        <div className="my-2 border-t border-border" />

        <button
          type="button"
          onClick={handleBackToUserDashboard}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to User View
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log Out
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted">© 2026 SkillSyncAI</p>
      </div>
    </aside>
  );
}