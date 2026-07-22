import { Link } from "react-router-dom";
import {
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";


const jobs = [
  {
    title: "Frontend Developer",
    company: "Accenture",
    match: "92%",
    skills: ["React", "JavaScript", "UI Design"],
  },
  {
    title: "Software Engineer",
    company: "Lexmark",
    match: "86%",
    skills: ["Programming", "Problem Solving"],
  },
  {
    title: "Full Stack Developer",
    company: "Arcanys",
    match: "84%",
    skills: ["Node.js", "React"],
  },
];


export default function JobPreview() {

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

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex gap-3">

          <div
            className="
            flex h-11 w-11
            items-center justify-center
            rounded-2xl
            bg-primary/10
            "
          >

            <Briefcase
              className="text-primary"
              size={22}
            />

          </div>


          <div>

            <h2 className="font-bold text-ink">
              Job Matches
            </h2>

            <p className="text-sm text-muted">
              Opportunities based on your skills
            </p>

          </div>


        </div>


      </div>



      {/* Jobs */}

      <div className="mt-6 space-y-4">


        {jobs.map((job) => (

          <div
            key={job.title}
            className="
            rounded-2xl
            border border-border
            p-4
            transition
            hover:border-primary/40
            "
          >


            <div className="flex items-start justify-between">


              <div>

                <h3 className="font-semibold text-ink">
                  {job.title}
                </h3>


                <p className="text-sm text-muted">
                  {job.company}
                </p>


              </div>



              <span
                className="
                rounded-full
                bg-emerald-100
                px-3
                py-1
                text-xs
                font-semibold
                text-emerald-700
                "
              >

                {job.match}

              </span>


            </div>



            <div className="mt-3 flex flex-wrap gap-2">


              {job.skills.map((skill) => (

                <span
                  key={skill}
                  className="
                  flex items-center gap-1
                  rounded-full
                  bg-surface-alt
                  px-3
                  py-1
                  text-xs
                  text-muted
                  "
                >

                  <CheckCircle2
                    size={12}
                    className="text-primary"
                  />

                  {skill}

                </span>

              ))}


            </div>


          </div>

        ))}


      </div>



      <Link
        to="/dashboard/jobs"
        className="
        mt-6
        inline-flex
        items-center
        gap-2
        text-sm
        font-semibold
        text-primary
        hover:underline
        "
      >

        Browse all jobs

        <ArrowRight size={16}/>

      </Link>


    </div>
  );
}