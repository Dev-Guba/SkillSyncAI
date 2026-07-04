import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const { user, loading } = useAuth();

      if (loading) {
          return <p>Loading...</p>;
      }

      if (!user) {
          return <p>No user found.</p>;
      }
      
          const profile = user?.UserProfile;
    const skills = user?.SkillSets ?? [];

    const fullName = profile
        ? `${profile.first_name} ${profile.last_name}`
        : user?.username;

    const beginner = skills.filter(
        (skill) => skill.UserSkill.proficiency_level === "Beginner"
    ).length;

    const intermediate = skills.filter(
        (skill) => skill.UserSkill.proficiency_level === "Intermediate"
    ).length;

    const advanced = skills.filter(
        (skill) => skill.UserSkill.proficiency_level === "Advanced"
    ).length;

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

    const completedFields = requiredFields.filter(Boolean).length;

    const profileCompletion = Math.round(
        (completedFields / requiredFields.length) * 100
    );

    return (
        <section className="space-y-8 p-6">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome back, {fullName} 👋
                </h1>

                <p className="mt-1 text-muted">
                    {profile?.location || "No location provided"}
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-muted">
                        Profile Completion
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">
                        {profileCompletion}%
                    </h2>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-muted">
                        Total Skills
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">
                        {skills.length}
                    </h2>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-muted">
                        Account
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                        {user?.username}
                    </h2>
                </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Your Skills
                </h2>

                {skills.length === 0 ? (
                    <p className="mt-4 text-muted">
                        No skills added yet.
                    </p>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {skills.map((skill) => (
                            <div
                                key={skill.skill_set_id}
                                className="rounded-xl border p-4"
                            >
                                <h3 className="font-semibold">
                                    {skill.skill_set_name}
                                </h3>

                                <p className="mt-2 text-sm text-muted">
                                    {skill.UserSkill.proficiency_level}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skill Statistics */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">
                        Beginner
                    </h3>

                    <p className="mt-2 text-3xl font-bold">
                        {beginner}
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">
                        Intermediate
                    </h3>

                    <p className="mt-2 text-3xl font-bold">
                        {intermediate}
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">
                        Advanced
                    </h3>

                    <p className="mt-2 text-3xl font-bold">
                        {advanced}
                    </p>
                </div>
            </div>
        </section>
    );
}