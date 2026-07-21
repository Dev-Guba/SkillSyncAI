import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Briefcase,
  ArrowRight,
} from "lucide-react";


const actions = [
  {
    title: "Analyze your skill gap",
    description:
      "Discover which skills you need to reach your target career.",
    icon: Brain,
    to: "/dashboard/skill-gap",
  },
  {
    title: "Improve your profile",
    description:
      "Complete your profile to get better AI recommendations.",
    icon: Sparkles,
    to: "/dashboard/profile",
  },
  {
    title: "Find matching jobs",
    description:
      "Explore opportunities aligned with your skills.",
    icon: Briefcase,
    to: "/dashboard/jobs",
  },
];


export default function QuickActions() {
  return (
<section className="
  self-start
  rounded-3xl
  border
  border-border
  bg-surface
  p-4
  shadow-soft
">

      <div className="mb-4">

        <h2 className="text-xl font-bold text-ink">
          Next Steps
        </h2>

        <p className="mt-1 text-sm text-muted">
          Continue improving your career profile.
        </p>

      </div>



      <div className="space-y-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              to={action.to}
className="
  group
  flex
  items-center
  gap-3
  rounded-xl
  border
  border-border
  p-3
  transition-colors
  hover:border-primary/40
  hover:bg-primary/5
"
            >

              <div className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary-100
              ">

                <Icon
                  className="text-primary"
                  size={22}
                />

              </div>


              <div className="flex-1">

                <h3 className="
                  font-semibold
                  text-ink
                  group-hover:text-primary
                ">
                  {action.title}
                </h3>

<p className="
  mt-1
  text-xs
  leading-relaxed
  text-muted
">
                  {action.description}
                </p>

              </div>


              <ArrowRight
                size={18}
                className="
                  text-muted
                  transition-transform
                  group-hover:translate-x-1
                  group-hover:text-primary
                "
              />

            </Link>

          );

        })}

      </div>

    </section>
  );
}