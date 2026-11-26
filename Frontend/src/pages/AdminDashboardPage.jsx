
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Users,
  GitBranch,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { API } from "@/api/api.js";
import Button from "@/components/common/Button";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    skills: 0,
    programs: 0,
    jobTitles: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const [skillsRes, programsRes, jobsRes] = await Promise.allSettled([
          API.getallSkillSet(),
          API.getAllPrograms(),
          API.getAllJobSkills(),
        ]);

        if (!active) return;

        // Extract arrays from different API response structures
        const extractArray = (res, possibleKeys = []) => {
          if (res.status !== "fulfilled") {
            console.error("Failed to fetch dashboard data:", res.reason);
            return [];
          }

          let data = res.value?.data;

          // Handle nested Axios/API responses
          for (let i = 0; i < 3; i++) {
            if (Array.isArray(data)) return data;
            if (!data || typeof data !== "object") return [];

            const matchingKey = possibleKeys.find((key) =>
              Array.isArray(data[key])
            );

            if (matchingKey) return data[matchingKey];

            data = data.data;
          }

          return Array.isArray(data) ? data : [];
        };

        const skills = extractArray(skillsRes, [
          "skillSets",
          "skills",
        ]);

        const programs = extractArray(programsRes, [
          "programs",
        ]);

        const jobs = extractArray(jobsRes, [
          "jobTitles",
          "job_titles",
          "jobs",
        ]);

        setCounts({
          skills: skills.length,
          programs: programs.length,
          jobTitles: jobs.length,
        });

        console.log("Admin Dashboard Summary:", {
          skills: skills.length,
          programs: programs.length,
          jobTitles: jobs.length,
        });
      } catch (error) {
        console.error("Error loading dashboard summary:", error);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  const statCards = [
    {
      label: "Total Skills",
      value: counts.skills,
      icon: Sparkles,
      to: "/admin/skills",
    },
    {
      label: "Academic Programs",
      value: counts.programs,
      icon: GraduationCap,
      to: "/admin/catalog",
    },
    {
      label: "Job Titles",
      value: counts.jobTitles,
      icon: Briefcase,
      to: "/admin/jobs",
    },
  ];

  const quickModules = [
    {
      title: "Users & Roles",
      desc: "Manage Admin and Student accounts.",
      icon: Users,
      to: "/admin/users",
    },
    {
      title: "Program Mappings",
      desc: "Assign skills and careers to each academic program.",
      icon: GitBranch,
      to: "/admin/mappings",
    },
    {
      title: "Jobs & Importer",
      desc: "Inspect active postings and import fresh jobs per career.",
      icon: Briefcase,
      to: "/admin/jobs",
    },
    {
      title: "Admin Settings",
      desc: "Toggle theme and reset local frontend overrides.",
      icon: Settings,
      to: "/admin/settings",
    },
  ];

  return (
    <section className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-alt p-6 shadow-soft sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#5B4BFF]/20 to-[#7A5CFF]/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              Admin Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold text-ink">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted">
              Manage users, skills, academic programs, job mappings, job
              imports, and curriculum alignment from one console.
            </p>
          </div>

          <Button
            variant="primary"
            icon={ArrowRight}
            onClick={() => navigate("/admin/skills")}
          >
            Manage Skills
          </Button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, to }) => (
          <div
            key={label}
            onClick={() => navigate(to)}
            className="cursor-pointer rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">
                {label}
              </span>

              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-3xl font-extrabold text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Module Launchpad */}
      <div>
        <h2 className="mb-3 text-base font-bold text-ink">
          Admin Tools
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickModules.map(({ title, desc, icon: Icon, to }) => (
            <button
              key={title}
              type="button"
              onClick={() => navigate(to)}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left shadow-soft transition hover:border-primary/50"
            >
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink">
                  {title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
