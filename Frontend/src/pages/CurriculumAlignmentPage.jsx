import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import CurriculumAlignmentView from "@/components/curriculum/CurriculumAlignmentView";

// Student view: how well their program matches what Cebu employers ask for
export default function CurriculumAlignmentPage() {
  const { user } = useAuth();
  const profile = user?.UserProfile;
  const programId = profile?.program_id;
  const program = profile?.Program;
  const studentSkills = (user?.SkillSets || []).map((s) => s.skill_set_name);

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={BookOpen}
        eyebrow="Curriculum alignment"
        title={program?.program_code ? `${program.program_code} vs the job market` : "Your program vs the job market"}
        subtitle="Compares the skills your program teaches with what Cebu employers ask for in its careers."
      />
      <CurriculumAlignmentView programId={programId} audience="student" studentSkills={studentSkills} />
    </section>
  );
}
