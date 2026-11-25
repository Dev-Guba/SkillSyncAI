import { useId } from "react";
import { GraduationCap, Lock } from "lucide-react";
import { RESEARCH_SCHOOL } from "@/data/cebuSchools";

// Read-only: the study runs only at UCLM, so the school can't be changed.
export default function SchoolSelect({ label = "School" }) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="text"
          value={RESEARCH_SCHOOL}
          readOnly
          aria-readonly="true"
          className="w-full cursor-default rounded-xl border border-border bg-surface-alt px-10 py-2.5 text-sm text-ink outline-none"
        />
        <Lock
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>

      <p className="text-xs text-muted">
        SkillSyncAI is currently available to UCLM students only.
      </p>
    </div>
  );
}
