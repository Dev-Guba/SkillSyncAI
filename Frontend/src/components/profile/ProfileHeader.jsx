import { Pencil, MapPin, Briefcase } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";

export default function ProfileHeader({
  profile,
  jobTitle,
  onEdit,
  onEditJobTitle,
}) {
  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface-alt p-6 shadow-soft">
        <p className="text-sm text-muted">Loading profile...</p>
      </div>
    );
  }

  const fullName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

  const jobTitleName =
    jobTitle?.job_title_name ||
    jobTitle?.title ||
    jobTitle?.name ||
    null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-alt p-6 shadow-soft sm:p-8">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#5B4BFF]/20 to-[#7A5CFF]/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar
            firstName={profile.first_name}
            lastName={profile.last_name}
            size="lg"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-ink">
                {fullName || "Unnamed User"}
              </h1>

              <button
                type="button"
                onClick={onEditJobTitle}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
                title="Change Target Job Title"
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>{jobTitleName || "Set Target Job Title"}</span>
                <Pencil className="ml-0.5 h-3 w-3 opacity-70" />
              </button>
            </div>

            {profile.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            )}

            {profile.bio && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onEditJobTitle && (
            <Button
              variant="ghost"
              size="sm"
              icon={Briefcase}
              onClick={onEditJobTitle}
            >
              Edit Job Title
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={Pencil}
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}