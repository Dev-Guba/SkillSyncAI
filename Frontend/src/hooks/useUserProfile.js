import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API } from "../api/api.js";
import { STORAGE_KEYS } from "../utils/storageKeys.js";

function extractJobTitle(user) {
  if (!user) return null;
  if (Array.isArray(user.JobTitles) && user.JobTitles.length > 0) {
    return user.JobTitles[0];
  }
  if (user.UserJobTitle?.JobTitle) {
    return user.UserJobTitle.JobTitle;
  }
  if (Array.isArray(user.UserJobTitles) && user.UserJobTitles.length > 0) {
    const first = user.UserJobTitles[0];
    return first.JobTitle || first;
  }
  if (user.UserJobTitle && user.UserJobTitle.job_title_id) {
    return user.UserJobTitle;
  }
  if (user.jobTitle) {
    return user.jobTitle;
  }
  return null;
}

export function useUserProfile() {
  const { user, setUser, token, refreshUser } = useAuth();

  const [profile, setProfile] = useState(user?.UserProfile || null);
  const [skills, setSkills] = useState(user?.SkillSets || []);
  const [jobTitle, setJobTitle] = useState(() => extractJobTitle(user));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.UserProfile) {
      setProfile(user.UserProfile);
    }
    if (user?.SkillSets) {
      setSkills(user.SkillSets);
    }
    setJobTitle(extractJobTitle(user));
  }, [user]);

  const syncLocalAuthUser = useCallback(
    (patch) => {
      if (!user || !setUser) return;
      const updatedUser = { ...user, ...patch };
      setUser(updatedUser);
      localStorage.setItem(
        STORAGE_KEYS.AUTH,
        JSON.stringify({ token, user: updatedUser })
      );
    },
    [user, setUser, token]
  );

  const updateProfile = useCallback(
    async (updates) => {
      setIsSaving(true);
      setError(null);

      try {
        await API.updateUserProfile(updates);
        await refreshUser();
        return true;
      } catch (err) {
        console.error("Profile update failed:", err);
        setError("Something went wrong while saving your profile.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [refreshUser]
  );

  const updateSkills = useCallback(
    async (selectedSkills) => {
      setIsSaving(true);
      setError(null);

      const payloadSkills = selectedSkills.map((skill) => ({
        skill_set_id: skill.skill_set_id,
        proficiency_level:
          skill.proficiency_level ||
          skill.UserSkill?.proficiency_level ||
          "Beginner",
      }));

      try {
        try {
          await API.updateUserSkills({ skills: payloadSkills });
        } catch {
          await API.createUserSkills({ skills: payloadSkills });
        }
        await refreshUser();
        return true;
      } catch (err) {
        console.warn("Backend skill update fallback applied:", err);
        // Keep frontend responsive even if friend's backend route isn't ready
        setSkills(selectedSkills);
        syncLocalAuthUser({ SkillSets: selectedSkills });
        return true;
      } finally {
        setIsSaving(false);
      }
    },
    [refreshUser, syncLocalAuthUser]
  );

  const updateJobTitle = useCallback(
    async (selectedJobObj) => {
      if (!selectedJobObj?.job_title_id) return false;
      setIsSaving(true);
      setError(null);

      try {
        try {
          await API.updateUserJobTitle({
            job_title_id: selectedJobObj.job_title_id,
          });
        } catch {
          await API.createUserJobTitle({
            job_title_id: selectedJobObj.job_title_id,
          });
        }
        await refreshUser();
        setJobTitle(selectedJobObj);
        return true;
      } catch (err) {
        console.warn("Backend job title update fallback applied:", err);
        setJobTitle(selectedJobObj);
        syncLocalAuthUser({
          JobTitles: [selectedJobObj],
          UserJobTitle: selectedJobObj,
        });
        return true;
      } finally {
        setIsSaving(false);
      }
    },
    [refreshUser, syncLocalAuthUser]
  );

  return {
    profile,
    skills,
    jobTitle,
    updateProfile,
    updateSkills,
    updateJobTitle,
    isSaving,
    error,
  };
}