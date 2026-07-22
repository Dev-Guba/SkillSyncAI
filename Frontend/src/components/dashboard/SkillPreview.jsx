import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function SkillPreview() {

    const { user } = useAuth();

    const skills = user?.SkillSets ?? [];


    const displaySkills = skills.length
        ? skills.slice(0, 4)
        : [
            {
                skill_set_name: "React",
                proficiency_level: "Advanced",
            },
            {
                skill_set_name: "JavaScript",
                proficiency_level: "Intermediate",
            },
            {
                skill_set_name: "Python",
                proficiency_level: "Beginner",
            },
        ];


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
                        <Sparkles
                            size={22}
                            className="text-primary"
                        />
                    </div>


                    <div>

                        <h2 className="font-bold text-ink">
                            Your Skills
                        </h2>

                        <p className="text-sm text-muted">
                            Skills powering your career matches
                        </p>

                    </div>

                </div>


                <Link
                    to="/dashboard/profile"
                    className="
                    flex items-center gap-1
                    text-sm
                    font-medium
                    text-primary
                    "
                >
                    View
                    <ArrowRight size={15}/>
                </Link>

            </div>



            {/* Skills */}

            <div className="mt-6 space-y-3">

                {displaySkills.map((skill) => (

                    <div
                        key={skill.skill_set_name}
                        className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        bg-surface-alt
                        px-4
                        py-3
                        "
                    >

                        <span className="font-medium text-ink">
                            {skill.skill_set_name}
                        </span>


                        <span
                            className="
                            rounded-full
                            bg-primary/10
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-primary
                            "
                        >
                            {skill.proficiency_level || "Added"}
                        </span>

                    </div>

                ))}

            </div>



            {/* Bottom Insight */}

            <div
                className="
                mt-6
                rounded-2xl
                bg-gradient-to-r
                from-primary/10
                to-violet-100
                p-4
                "
            >

                <p className="text-xs text-muted">
                    Strongest career area
                </p>


                <p className="mt-1 font-bold text-ink">
                    Frontend Development
                </p>

            </div>


        </div>
    );
}