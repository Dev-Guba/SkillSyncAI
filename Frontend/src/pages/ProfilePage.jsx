import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { User } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import { useUserProfile } from "@/hooks/useUserProfile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoGrid from "@/components/profile/ProfileInfoGrid";
import ProfileSkills from "@/components/profile/ProfileSkills";
import EditProfileModal from "@/components/profile/EditProfileModal";
import EditCareerSkillsModal from "@/components/profile/EditCareerSkillsModal";

import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";

export default function ProfilePage() {
  const {
    profile,
    skills,
    jobTitle,
    updateProfile,
    updateProfilePicture,
    updateSkills,
    updateJobTitle,
    isSaving,
    error: saveError,
  } = useUserProfile();

  const [openEdit, setOpenEdit] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // "/dashboard/profile?edit=1" (from the dashboard's "Complete your profile")
  // opens the Edit Profile form straight away.
  useEffect(() => {
    if (searchParams.get("edit") === "1" && profile) {
      setOpenEdit(true);
      const next = new URLSearchParams(searchParams);
      next.delete("edit");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, profile]);
  const [careerModalState, setCareerModalState] = useState({
    isOpen: false,
    tab: "skills",
  });

  if (!profile) {
    return <div className="p-6 text-muted">Loading profile...</div>;
  }

  return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={User}
        eyebrow="Your account"
        title="My Profile"
        subtitle="Your details, skills and target career. Keep them up to date for better matches."
      />

      <ProfileHeader
        profile={profile}
        jobTitle={jobTitle}
        onEdit={() => setOpenEdit(true)}
        onChangePicture={updateProfilePicture}
        onEditJobTitle={() =>
          setCareerModalState({ isOpen: true, tab: "job" })
        }
      />

      <ProfileCompletionCard onEdit={() => setOpenEdit(true)} />

      <ProfileInfoGrid profile={profile} jobTitle={jobTitle} />

      <ProfileSkills
        skills={skills}
        onEditSkills={() =>
          setCareerModalState({ isOpen: true, tab: "skills" })
        }
      />

      <EditProfileModal
        profile={profile}
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={updateProfile}
        isSaving={isSaving}
        saveError={saveError}
      />

      <EditCareerSkillsModal
        isOpen={careerModalState.isOpen}
        initialTab={careerModalState.tab}
        currentSkills={skills}
        currentJobTitle={jobTitle}
        onClose={() =>
          setCareerModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSaveSkills={updateSkills}
        onSaveJobTitle={updateJobTitle}
        isSaving={isSaving}
        saveError={saveError}
      />
    </section>
  );
}