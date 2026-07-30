import {
    LayoutDashboard,
    Sparkles,
    Brain,
    Briefcase,
    Map
} from "lucide-react";


export default function DashboardSwitcher({
    active,
    setActive
}) {


    const views = [
        {
            id: "skills",
            label: "Skills",
            icon: Sparkles
        },
        {
            id: "ai",
            label: "AI Coach",
            icon: Brain
        },
        {
            id: "jobs",
            label: "Jobs",
            icon: Briefcase
        },
        {
            id: "roadmap",
            label: "Roadmap",
            icon: Map
        },
        {
            id: "all",
            label: "All",
            icon: LayoutDashboard
        }
    ];



    return (
        <div
            className="
            overflow-x-auto
            rounded-2xl
            border border-border
            bg-surface
            p-2
            shadow-soft
            "
        >

            <div
                className="
                flex
                min-w-max
                gap-2
                "
            >

                {
                    views.map((view)=>{

                        const Icon = view.icon;

                        const isActive =
                            active === view.id;


                        return (

                            <button
                                key={view.id}
                                onClick={() => setActive(view.id)}
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200

                                    ${
                                    isActive
                                    ?
                                    `
                                    bg-primary
                                    text-white
                                    shadow-soft
                                    `
                                    :
                                    `
                                    text-muted
                                    hover:bg-primary/10
                                    hover:text-primary
                                    `
                                    }
                                `}
                            >

                                <Icon
                                    size={18}
                                />

                                <span>
                                    {view.label}
                                </span>

                            </button>

                        );

                    })
                }

            </div>

        </div>
    );
}