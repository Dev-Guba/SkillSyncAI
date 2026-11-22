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
  X,
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
  // {
  //   to: "/admin/interests",
  //   label: "Manage Interests",
  //   icon: Heart,
  // },
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

export default function AdminSidebar({ isMobileOpen = false, onClose }) {
  const navigate = useNavigate();
  const { setAdminMode, logout } = useAuth();

  const handleBackToUserDashboard = () => {
    setAdminMode?.(false);
    onClose?.();
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setAdminMode?.(false);
    onClose?.();
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface">
      {/* Logo */}
      <div className="flex items-start justify-between px-6 py-6">
        <div>
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

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-alt hover:text-ink lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 pb-4">
        {adminNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink/70 hover:bg-primary/10 hover:text-primary"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="my-2 border-t border-border" />

        <button
          type="button"
          onClick={handleBackToUserDashboard}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          <span>Back to User View</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Log Out</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted">© 2026 SkillSyncAI</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-surface lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile / Split-Screen Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] border-r border-border bg-surface shadow-soft-lg">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}