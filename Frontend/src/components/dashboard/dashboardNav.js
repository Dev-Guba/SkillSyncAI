import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  Map,
  Settings,
  BookOpen,
} from "lucide-react";

// Student dashboard menu, shared by the sidebar and the mobile menu
export const DASHBOARD_NAV = [
  { to: "/dashboard", label: "Overview", short: "Home", icon: LayoutDashboard, end: true },
  { to: "/dashboard/profile", label: "My Profile", short: "Profile", icon: User },
  { to: "/dashboard/recommendations", label: "Recommended Skills", short: "Skills", icon: Sparkles },
  { to: "/dashboard/jobs", label: "Job Recommendations", short: "Jobs", icon: Briefcase },
  { to: "/dashboard/roadmap", label: "Career Roadmap", short: "Roadmap", icon: Map },
  { to: "/dashboard/curriculum", label: "Curriculum Alignment", short: "Curriculum", icon: BookOpen },
  { to: "/dashboard/settings", label: "Settings", short: "Settings", icon: Settings },
];
