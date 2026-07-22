import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const profile = user?.UserProfile;

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.username;

  return (
    <section className="flex flex-col gap-2">

      <p className="text-sm font-medium text-primary">
        Career Overview
      </p>

      <h1 className="text-3xl font-bold text-ink sm:text-4xl">
        Good to see you, {fullName} 👋
      </h1>

      <p className="max-w-xl text-muted">
        Track your skills, discover opportunities, and
        continue building your career path.
      </p>

    </section>
  );
}