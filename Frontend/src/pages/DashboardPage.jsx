import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";
import SkillPreview from "@/components/dashboard/SkillPreview";
import RecommendationPreview from "@/components/dashboard/RecommendationPreview";
import JobPreview from "@/components/dashboard/JobPreview";
import RoadmapPreview from "@/components/dashboard/RoadmapPreview";
import QuickActions from "@/components/dashboard/QuickActions";


export default function DashboardPage() {

    return (
        <section className="space-y-6 p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <DashboardHeader />


            {/* STATISTICS */}
            <StatsCards />


            {/* PROFILE + QUICK ACTION */}
<div className="
    grid
    items-start
    gap-6
    lg:grid-cols-12
">

                <div className="lg:col-span-8">
                    <ProfileCompletionCard />
                </div>


                <div className="lg:col-span-4">
    <QuickActions />
</div>

            </div>



            {/* SKILLS + RECOMMENDATIONS */}

            <div className="
                grid
                gap-6
                lg:grid-cols-2
            ">

                <SkillPreview />

                <RecommendationPreview />

            </div>



            {/* JOB + ROADMAP */}

<div className="
    grid
    items-start
    gap-6
    lg:grid-cols-2
">

                <JobPreview />

                <RoadmapPreview />

            </div>


        </section>
    );
}