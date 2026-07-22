export default function SkillGapScore({ score = 78 }) {
  return (
    <div className="
  rounded-2xl
  border border-border
  bg-surface
  p-6
  shadow-soft
">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Skill Match Score
          </h2>

          <p className="mt-1 text-sm text-muted">
            Based on your current skills and career goal.
          </p>
        </div>

        <span className="text-3xl font-bold text-primary">
          {score}%
        </span>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-surface-alt">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#7A5CFF]"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}