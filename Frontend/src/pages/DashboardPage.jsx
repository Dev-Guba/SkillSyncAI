import { useEffect, useState, useRef } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SkillPreview from "@/components/dashboard/SkillPreview";
import RecommendationPreview from "@/components/dashboard/RecommendationPreview";
import MissingSkills from "@/components/dashboard/MissingSkills";
import JobPreview from "@/components/dashboard/JobPreview";
import RoadmapPreview from "@/components/dashboard/RoadmapPreview";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardSwitcher from "@/components/dashboard/DashboardSwitcher";

import { API } from "@/api/api";
import { useAuth } from "@/context/AuthContext";


export default function DashboardPage() {

    const { user } = useAuth();

    const [aiData,setAiData] = useState(null);
    const aiRequested = useRef(false);
    const [activeView, setActiveView] = useState("all");

    const visibleSections = {
    skills: [
        "skills"
    ],

    ai: [
        "ai",
        "missing"
    ],

    jobs: [
        "jobs"
    ],

    roadmap: [
        "roadmap"
    ],

    all: [
        "stats",
        "quick",
        "skills",
        "ai",
        "missing",
        "jobs",
        "roadmap"
    ]
};


const showSection = (section) =>
    visibleSections[activeView]?.includes(section);


useEffect(()=>{

    const fetchAIRecommendation = async()=>{

        if(aiRequested.current) return;


        aiRequested.current = true;


        try {

            const response =
                await API.getAIRecommendation({

                    user_id:user.user_id,

                    job_title_id:
                    user.JobTitles?.[0]?.job_title_id

                });


            console.log(
                "AI RESPONSE:",
                response.data.data
            );


            setAiData(
                response.data.data
            );


        } catch(error){

            console.error(
                "AI Recommendation Error:",
                error
            );

            aiRequested.current = false;

        }

    };


    if(
        user?.user_id &&
        user?.JobTitles?.length > 0
    ){
        fetchAIRecommendation();
    }


},[
    user?.user_id,
    user?.JobTitles?.[0]?.job_title_id
]);



return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8">


            {/* HEADER */}
            <DashboardHeader />

                        <DashboardSwitcher
                active={activeView}
                setActive={setActiveView}
            />



          {/* STATISTICS */}

{
showSection("stats") && (
    <StatsCards />
)
}



{/* QUICK ACTION */}

{
showSection("quick") && (
    <QuickActions />
)
}


{
(showSection("skills") || showSection("ai")) && (
<div
    className={`
        grid
        gap-6
        ${
            showSection("skills") && showSection("ai")
            ? "lg:grid-cols-2"
            : "lg:grid-cols-1"
        }
        items-stretch
    `}
>
{
showSection("skills") && (
    <SkillPreview />
)
}


{
showSection("ai") && (
    <RecommendationPreview
        recommendations={
            aiData
            ?.recommendation
            ?.learning_recommendations || []
        }
    />
)
}


</div>
)
}



{
showSection("missing") && (
    <MissingSkills
        skills={
            aiData?.analysis?.missing_skills || []
        }
    />
)
}

{
(showSection("jobs") || showSection("roadmap")) && (
<div
    className={`
        grid
        gap-6
        ${
            showSection("jobs") && showSection("roadmap")
            ? "lg:grid-cols-2"
            : "lg:grid-cols-1"
        }
        items-stretch
    `}
>

{
showSection("jobs") && (
    <JobPreview />
)
}

{
showSection("roadmap") && (
    <RoadmapPreview />
)
}


</div>
)
}


        </section>
    );
}