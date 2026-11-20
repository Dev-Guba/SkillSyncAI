import { useState } from "react";

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
    updateSkills,
    updateJobTitle,
    isSaving,
  } = useUserProfile();

  const [openEdit, setOpenEdit] = useState(false);
  const [careerModalState, setCareerModalState] = useState({
    isOpen: false,
    tab: "skills",
  });

  if (!profile) {
    return <div className="p-6 text-muted">Loading profile...</div>;
  }

  return (
    <section className="space-y-6 p-6">
      <ProfileHeader
        profile={profile}
        jobTitle={jobTitle}
        onEdit={() => setOpenEdit(true)}
        onEditJobTitle={() =>
          setCareerModalState({ isOpen: true, tab: "job" })
        }
      />

      <ProfileCompletionCard />

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
      />
    </section>
  );
}