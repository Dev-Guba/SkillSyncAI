import { Link } from "react-router-dom";
import { UserCircle, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PROFILE_FIELDS = [
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone number" },
  { key: "birth_date", label: "Birth date" },
  { key: "gender", label: "Gender" },
  { key: "bio", label: "Bio" },
  { key: "location", label: "Location" },
];

// Treats empty and whitespace-only strings as not filled in
const isFilled = (value) =>
  typeof value === "string" ? value.trim().length > 0 : Boolean(value);

export default function ProfileCompletionCard() {
  const { user } = useAuth();

  const profile = user?.UserProfile;

  const fullName =
    [profile?.first_name, profile?.last_name]
      .filter(isFilled)
      .join(" ")
      .trim() || user?.username;

  const missing = PROFILE_FIELDS.filter(
    (field) => !isFilled(profile?.[field.key])
  );

  const total = PROFILE_FIELDS.length;
  const completed = total - missing.length;
  const completion = Math.round((completed / total) * 100);
  const isComplete = missing.length === 0;

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
          flex h-12 w-12 shrink-0
          items-center justify-center
          rounded-2xl
          bg-primary/10
          "
        >
          <UserCircle size={28} className="text-primary" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-ink">
            Your career profile
          </h2>

          {fullName && (
            <p className="truncate text-sm text-muted">{fullName}</p>
          )}
        </div>
      </div>

      {/* Progress */}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">
            Profile completion
          </p>

          <p className="text-sm font-semibold text-primary">
            {completion}%
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completion}
          className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-muted">
          {completed} of {total} details filled in
        </p>
      </div>

      {/* Missing details */}

      {!isComplete && (
        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Still missing</p>

          <ul className="mt-2 flex flex-wrap gap-2">
            {missing.map((field) => (
              <li
                key={field.key}
                className="
                rounded-full
                border border-border
                px-2.5 py-1
                text-xs text-muted
                "
              >
                {field.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action */}

      {isComplete ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Check size={16} className="text-primary" aria-hidden="true" />
            Your profile is complete
          </p>

          <Link
            to="/dashboard/profile"
            className="
            flex items-center gap-1.5
            rounded-md
            text-sm font-semibold text-primary
            hover:underline
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
            "
          >
            Edit profile
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <Link
          to="/dashboard/profile"
          className="
          mt-6
          flex w-full items-center justify-center gap-2
          rounded-xl
          bg-primary
          px-4 py-2.5
          text-sm font-semibold text-white
          hover:opacity-90
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2
          "
        >
          Complete your profile
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}