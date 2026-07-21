import { useState } from "react";

import { useUserProfile } from "@/hooks/useUserProfile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoGrid from "@/components/profile/ProfileInfoGrid";
import EditProfileModal from "@/components/profile/EditProfileModal";

import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";

export default function ProfilePage() {
const {
  profile,
  updateProfile,
  isSaving,
} = useUserProfile();

  const [openEdit, setOpenEdit] = useState(false);


if (!profile) {
  return (
    <div className="p-6 text-muted">
      Loading profile...
    </div>
  );
}


  if (!profile) {
    return (
      <div className="p-6 text-muted">
        No profile information found.
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6">


      <ProfileHeader
        profile={profile}
        onEdit={() => setOpenEdit(true)}
      />


<ProfileCompletionCard />


      <ProfileInfoGrid
        profile={profile}
      />


<EditProfileModal
  profile={profile}
  isOpen={openEdit}
  onClose={() => setOpenEdit(false)}
  onSave={updateProfile}
  isSaving={isSaving}
/>


    </section>
  );
}