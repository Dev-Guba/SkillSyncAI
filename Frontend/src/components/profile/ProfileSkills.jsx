import { Pencil, Sparkles } from "lucide-react";
import Button from "@/components/common/Button";

export default function ProfileSkills({ skills = [], onEditSkills }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">My Skills</h2>
            <p className="text-xs text-muted">
              Skills and proficiency levels linked to your career profile
            </p>
          </div>
        </div>

        {onEditSkills && (
          <Button
            variant="secondary"
            size="sm"
            icon={Pencil}
            onClick={onEditSkills}
          >
            Edit Skills
          </Button>
        )}
      </div>

      {skills.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted">
            No skills added yet. Click &ldquo;Edit Skills&rdquo; to select your
            skills.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2.5">
          {skills.map((skill) => {
            const level =
              skill.proficiency_level ||
              skill.UserSkill?.proficiency_level ||
              null;

            return (
              <div
                key={skill.skill_set_id || skill.skill_set_name}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary"
              >
                <span>{skill.skill_set_name}</span>
                {level && (
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink shadow-2xs">
                    {level}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}