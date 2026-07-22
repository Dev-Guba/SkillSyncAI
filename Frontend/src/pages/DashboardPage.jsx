import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";
import SkillPreview from "@/components/dashboard/SkillPreview";
import RecommendationPreview from "@/components/dashboard/RecommendationPreview";
import MissingSkills from "@/components/dashboard/MissingSkills";
import JobPreview from "@/components/dashboard/JobPreview";
import RoadmapPreview from "@/components/dashboard/RoadmapPreview";
import QuickActions from "@/components/dashboard/QuickActions";

import { API } from "@/api/api";
import { useAuth } from "@/context/AuthContext";


export default function DashboardPage() {

    const { user } = useAuth();

    const [aiData,setAiData] = useState(null);


    useEffect(()=>{

        const fetchAIRecommendation = async()=>{

            try {

                const response =
                    await API.getAIRecommendation({

                        user_id:user.user_id,

                        job_title_id:
                        user.JobTitles?.[0]?.job_title_id

                    });


                console.log("AI RESPONSE:", response.data.data);
                setAiData(
                    response.data.data
                );


            } catch(error){

                console.error(
                    "AI Recommendation Error:",
                    error
                );

            }

        };


        if(user && user.JobTitles?.length > 0){
            fetchAIRecommendation();
        }


    },[user]);



    return (
        <section className="space-y-6 p-4 sm:p-6 lg:p-8">


            {/* HEADER */}
            <DashboardHeader />



            {/* STATISTICS */}
            <StatsCards />



            {/* PROFILE + QUICK ACTION */}

            <div
                className="
                grid
                items-start
                gap-6
                lg:grid-cols-12
                "
            >

                <div className="lg:col-span-8">
                    <ProfileCompletionCard />
                </div>


                <div className="lg:col-span-4">
                    <QuickActions />
                </div>


            </div>





            {/* SKILLS + AI */}

            <div
                className="
                grid
                gap-6
                lg:grid-cols-2
                "
            >

                <SkillPreview />


                <RecommendationPreview
                    recommendations={
                        aiData
                        ?.recommendation
                        ?.learning_recommendations || []
                    }
                />

            </div>



            {/* MISSING SKILLS */}
            <MissingSkills
                skills={
                    aiData?.analysis?.missing_skills || []
                }
            />





            {/* JOB + ROADMAP */}

            <div
                className="
                grid
                items-start
                gap-6
                lg:grid-cols-2
                "
            >

                <JobPreview />

                <RoadmapPreview />

            </div>


        </section>
    );
}