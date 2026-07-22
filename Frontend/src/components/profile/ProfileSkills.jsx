export default function ProfileSkills({ skills }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Skills
      </h2>

      {skills.length === 0 ? (
        <p className="mt-4 text-muted">
          No skills added yet.
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.skill_set_id}
              className="rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700"
            >
              {skill.skill_set_name}
            </div>
          ))}
        </div>
      )}
    </div>
);
}