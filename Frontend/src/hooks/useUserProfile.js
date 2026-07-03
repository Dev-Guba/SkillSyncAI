import { useState, useCallback } from "react";
import { mockUserProfile } from "@/data/mockProfile";

export function useUserProfile() {
  const [profile, setProfile] = useState(mockUserProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (updates) => {
    setIsSaving(true);
    setError(null);
    try {
      // Swap this for a real call later, e.g.:
      // await api.patch(`/user-profiles/${profile.user_profile_id}`, updates)
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProfile((prev) => ({ ...prev, ...updates }));
      return true;
    } catch {
      setError("Something went wrong while saving your profile.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { profile, updateProfile, isSaving, error };
}