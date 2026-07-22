export default function MissingSkills({
  skills = []
}) {
  return (
    <div
      className="
      rounded-2xl
      border border-border
      bg-surface
      p-6
      shadow-soft
      "
    >

      <h2 className="text-lg font-semibold">
        Missing Skills
      </h2>

      <p className="mt-1 text-sm text-muted">
        Skills commonly required for your target role.
      </p>


      <div className="mt-5 flex flex-wrap gap-3">

        {skills.map((skill) => (

          <div
            key={skill}
            className="
            rounded-full
            border
            border-orange-400/30
            bg-orange-400/10
            px-4
            py-2
            text-sm
            font-medium
            text-orange-500
            "
          >
            {skill}
          </div>

        ))}

      </div>

    </div>
  );
}