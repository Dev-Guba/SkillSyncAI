import { Mail, Phone, Calendar, UserRound, MapPin } from "lucide-react";
import { formatDate, calculateAge } from "@/utils/formatDate";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">

      <div className="rounded-lg bg-primary-100 p-2 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
        <Icon className="h-4 w-4" />
      </div>


      <div className="min-w-0">

        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>


        <p className="mt-0.5 truncate text-sm font-medium text-ink">
          {value || "—"}
        </p>

      </div>

    </div>
  );
}


export default function ProfileInfoGrid({ profile }) {

  if (!profile) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        Loading profile information...
      </div>
    );
  }


  const age = profile.birth_date
    ? calculateAge(profile.birth_date)
    : null;


  const birthDateLabel = profile.birth_date
    ? `${formatDate(profile.birth_date)}${age !== null ? ` (${age} yrs)` : ""}`
    : null;



  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      <InfoCard
        icon={Mail}
        label="Email"
        value={profile.email}
      />


      <InfoCard
        icon={Phone}
        label="Phone"
        value={profile.phone_number}
      />


      <InfoCard
        icon={Calendar}
        label="Birth Date"
        value={birthDateLabel}
      />


      <InfoCard
        icon={UserRound}
        label="Gender"
        value={profile.gender}
      />


      <InfoCard
        icon={MapPin}
        label="Location"
        value={profile.location}
      />

    </div>
  );
}