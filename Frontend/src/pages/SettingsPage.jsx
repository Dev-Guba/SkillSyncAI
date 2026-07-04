import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoGrid from "@/components/profile/ProfileInfoGrid";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function SettingsPage() {
  const { profile, updateProfile, isSaving } = useUserProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-6">
        <ProfileHeader profile={profile} onEdit={() => setIsEditOpen(true)} />
        <ProfileInfoGrid profile={profile} />
      </div>

      <EditProfileModal
        profile={profile}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={updateProfile}
        isSaving={isSaving}
      />
    </section>
  );
}