import {
  UserCircle,
  Brain,
  Briefcase,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function StatsCards() {
  const { user } = useAuth();

  const profile = user?.UserProfile;
  const skills = user?.SkillSets ?? [];

  const requiredFields = [
    profile?.first_name,
    profile?.last_name,
    profile?.email,
    profile?.phone_number,
    profile?.birth_date,
    profile?.gender,
    profile?.bio,
    profile?.location,
  ];

  const completed = requiredFields.filter(Boolean).length;

  const completion = Math.round(
    (completed / requiredFields.length) * 100
  );

  const careerReadiness = Math.min(
    100,
    completion + skills.length * 5
  );

  const jobMatches = skills.length * 3;


  const cards = [
    {
      title: "Profile Strength",
      value: `${completion}%`,
      subtitle: "Complete your profile",
      icon: UserCircle,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Skills Added",
      value: skills.length,
      subtitle: "Skills registered",
      icon: Sparkles,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      title: "Career Score",
      value: `${careerReadiness}%`,
      subtitle: "Career readiness",
      icon: Brain,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Job Matches",
      value: jobMatches,
      subtitle: "Recommended roles",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];


  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              rounded-2xl
              border border-border
              bg-surface
              p-4
              shadow-soft
              transition-all
              hover:-translate-y-1
              hover:shadow-soft-lg
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-muted">
                  {card.title}
                </p>

                <h2 className="
                  mt-3
                  text-3xl
                  font-bold
                  text-ink
                ">
                  {card.value}
                </h2>

                <p className="mt-2 text-xs text-muted">
                  {card.subtitle}
                </p>

              </div>


              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  ${card.bg}
                `}
              >

                <Icon
                  className={card.color}
                  size={24}
                />

              </div>

            </div>


          </div>
        );
      })}

    </section>
  );
}