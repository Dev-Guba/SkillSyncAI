import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API } from "../api/api.js";

export function useUserProfile() {

  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = useState(
    user?.UserProfile || null
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {

    if (user?.UserProfile) {
      setProfile(user.UserProfile);
    }

  }, [user]);


  const updateProfile = useCallback(async (updates) => {

    setIsSaving(true);
    setError(null);

    try {

      await API.updateUserProfile(updates);

      await refreshUser();

      return true;

    } catch(error) {

      console.error(
        "Profile update failed:",
        error
      );

      setError(
        "Something went wrong while saving your profile."
      );

      return false;

    } finally {

      setIsSaving(false);

    }

  }, [refreshUser]);


  return {
    profile,
    updateProfile,
    isSaving,
    error
  };
}