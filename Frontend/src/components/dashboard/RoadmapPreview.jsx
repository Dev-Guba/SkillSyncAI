import { Link } from "react-router-dom";
import { ArrowRight, Map } from "lucide-react";

const roadmap = [
  {
    title: "HTML & CSS",
    done: true,
  },
  {
    title: "JavaScript",
    done: true,
  },
  {
    title: "React",
    done: true,
  },
  {
    title: "Node.js",
    done: false,
  },
  {
    title: "Docker",
    done: false,
  },
];

export default function RoadmapPreview() {
  return (
    <div
  className="
    rounded-3xl
    border border-border
    bg-surface
    p-6
    shadow-soft
  "
>

      <div className="mb-5 flex items-start justify-between">

        <div>
          <h2 className="text-xl font-bold text-ink">
            Career Roadmap
          </h2>

          <p className="text-sm text-muted">
            Your suggested learning journey.
          </p>
        </div>

        <Map className="text-violet-600" />

      </div>

      <div className="space-y-4">

        {roadmap.map((step) => (
          <div
            key={step.title}
            className="
  flex
  items-center
  gap-3
  rounded-xl
  px-3
  py-2
  transition-colors
  hover:bg-primary/5
"
          >

            <div
  className={`h-3 w-3 shrink-0 rounded-full ${
              
                step.done
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />

            <span
              className={
                step.done
                  ? "font-medium"
                  : "text-gray-500"
              }
            >
              {step.title}
            </span>

          </div>
        ))}

      </div>

      <Link
        to="/dashboard/roadmap"
        className="
  mt-6
  inline-flex
  items-center
  gap-2
  font-semibold
  text-primary
  transition-colors
  hover:text-primary/80
"
      >
        View Full Roadmap
        <ArrowRight size={16} />
      </Link>

    </div>
  );
}