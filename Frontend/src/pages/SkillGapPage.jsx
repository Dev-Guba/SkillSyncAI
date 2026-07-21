import SkillGapScore from "../components/dashboard/SkillGapScore";
import MissingSkills from "../components/dashboard/MissingSkills";
import AIRecommendation from "../components/dashboard/AIRecommendation";


export default function SkillGapPage() {

  return (
    <section className="space-y-8 p-6">

      <div>
        <h1 className="text-3xl font-bold">
          Skill Gap Analyzer
        </h1>

        <p className="mt-2 text-muted">
          Understand your current skills and what you need
          to improve for your career goal.
        </p>
      </div>


      <SkillGapScore />


      <div className="
        grid
        gap-6
        lg:grid-cols-2
      ">
        <MissingSkills />

        <AIRecommendation />
      </div>


    </section>
  );
}