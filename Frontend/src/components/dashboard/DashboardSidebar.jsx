import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Target,
  Sparkles,
  Briefcase,
  Map,
  BookOpen,
  Settings,
} from "lucide-react";

const navItems = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/dashboard/profile",
    label: "My Profile",
    icon: User,
  },
  {
    to: "/dashboard/skill-gap",
    label: "Skill Gap Analyzer",
    icon: Target,
  },
  {
    to: "/dashboard/recommendations",
    label: "Recommended Skills",
    icon: Sparkles,
  },
  {
    to: "/dashboard/jobs",
    label: "Job Recommendations",
    icon: Briefcase,
  },
  {
    to: "/dashboard/roadmap",
    label: "Career Roadmap",
    icon: Map,
  },
  {
    to: "/dashboard/curriculum",
    label: "Curriculum Alignment",
    icon: BookOpen,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];


export default function DashboardSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-surface sm:flex sm:flex-col">

      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-ink">
          SkillSyncAI
        </h1>

        <p className="mt-1 text-xs text-muted">
          Career Intelligence Platform
        </p>
      </div>


      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-4">

        {navItems.map(
          ({ to, label, icon: Icon, end }) => (

<NavLink
  key={to}
  to={to}
  end={end}
  className={({ isActive }) =>
    `
    group flex items-center gap-3 rounded-xl px-4 py-3
    text-sm font-medium transition-colors duration-200

    ${
      isActive
        ? "bg-primary text-white shadow-sm"
        : "text-ink/70 hover:bg-primary/10 hover:text-primary"
    }
    `
  }
>

            <Icon
  className="
    h-5 w-5
    transition-transform duration-200
    group-hover:scale-105
  "
/>

            {label}

          </NavLink>

        ))}
      </nav>


      {/* Footer */}
      <div className="border-t border-border p-4">

        <p className="text-xs text-muted">
          © 2026 SkillSyncAI
        </p>

      </div>


    </aside>
  );
}