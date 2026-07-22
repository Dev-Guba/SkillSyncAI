import { Pencil, MapPin } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";

export default function ProfileHeader({ profile, onEdit }) {

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface-alt p-6 shadow-soft">
        <p className="text-sm text-muted">
          Loading profile...
        </p>
      </div>
    );
  }


  const fullName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();


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

            <h1 className="text-2xl font-bold text-ink">
              {fullName || "Unnamed User"}
            </h1>


            {
              profile.location && (

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">

                  <MapPin className="h-3.5 w-3.5" />

                  {profile.location}

                </p>

              )
            }


            {
              profile.bio && (

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                  {profile.bio}
                </p>

              )
            }

          </div>

        </div>


        <Button
          variant="secondary"
          size="sm"
          icon={Pencil}
          onClick={onEdit}
          className="shrink-0"
        >
          Edit Profile
        </Button>


      </div>

    </div>
  );
}