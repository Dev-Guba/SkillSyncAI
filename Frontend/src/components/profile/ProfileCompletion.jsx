import ProgressBar from "../common/ProgressBar";

export default function ProfileCompletion({ profile }) {

  const fields = [
    profile?.first_name,
    profile?.last_name,
    profile?.email,
    profile?.phone_number,
    profile?.birth_date,
    profile?.gender,
    profile?.bio,
    profile?.location,
  ];


  const totalFields = fields.length;

  const completed = fields.filter(
    Boolean
  ).length;


  const percent = totalFields
    ? Math.round((completed / totalFields) * 100)
    : 0;


  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-ink">
            Profile Completion
          </h2>

          <p className="mt-1 text-sm text-muted">
            Complete your profile for better recommendations.
          </p>

        </div>


        <span className="text-2xl font-bold text-primary">
          {percent}%
        </span>

      </div>


      <div className="mt-5">
        <ProgressBar value={percent} />
      </div>


      <p className="mt-3 text-sm text-muted">
        {completed} of {totalFields} profile details completed
      </p>

    </div>
  );
}