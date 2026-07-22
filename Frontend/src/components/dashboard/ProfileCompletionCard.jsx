import { Link } from "react-router-dom";
import { UserCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileCompletionCard() {
  const { user } = useAuth();

  const profile = user?.UserProfile;

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.username;


  const requiredFields = [
    profile?.first_name,
    profile?.last_name,
    profile?.email,
    profile?.phone_number,
    profile?.birth_date,
    profile?.gender,
    profile?.bio,
    profile?.location,
  ];


  const completed = requiredFields.filter(Boolean).length;

  const completion = Math.round(
    (completed / requiredFields.length) * 100
  );


  const remaining =
    requiredFields.length - completed;


  return (
    <div
      className="
      rounded-3xl
      border border-border
      bg-surface
      p-6
      shadow-soft
      "
    >

      {/* Header */}

      <div className="flex items-center gap-4">

        <div
          className="
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-primary/10
          "
        >
          <UserCircle
            size={32}
            className="text-primary"
          />
        </div>


        <div>

          <h2 className="text-lg font-bold text-ink">
            Your Career Profile
          </h2>

          <p className="text-sm text-muted">
            {fullName}
          </p>

        </div>

      </div>



      {/* Progress */}

      <div className="mt-8">

        <div className="flex items-center justify-between">

          <p className="text-sm font-medium text-ink">
            Profile Strength
          </p>

          <p className="text-sm font-semibold text-primary">
            {completion}%
          </p>

        </div>


        <div
          className="
          mt-3
          h-3
          overflow-hidden
          rounded-full
          bg-border
          "
        >

          <div
            className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-primary
            to-violet-400
            "
            style={{
              width: `${completion}%`,
            }}
          />

        </div>


      </div>



      <div className="mt-6 flex items-center justify-between">

        <p className="text-sm text-muted">

          {remaining > 0
            ? `${remaining} sections remaining`
            : "Profile completed 🎉"
          }

        </p>


        <Link
          to="/dashboard/profile"
          className="
          flex items-center gap-2
          text-sm
          font-semibold
          text-primary
          hover:underline
          "
        >

          Update Profile

          <ArrowRight size={16}/>

        </Link>


      </div>


    </div>
  );
}