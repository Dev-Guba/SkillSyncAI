import { useState } from "react";
import API from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { STORAGE_KEYS } from "@/utils/storageKeys";

export function useUserProfile() {
    const { user, setUser, token } = useAuth();

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const profile = user?.UserProfile;

    const updateProfile = async (updates) => {
        setIsSaving(true);
        setError(null);

        try {
            // 🔥 ensure clean payload (prevents Sequelize object bug)
            const cleanUpdates = {
                first_name: updates.first_name,
                last_name: updates.last_name,
                email: updates.email,
                phone_number: updates.phone_number,
                birth_date: updates.birth_date,
                gender: updates.gender,
                bio: updates.bio,
                location: updates.location,
            };
            console.log("UPDATES RAW:", updates);

            await API.updateUserProfile(cleanUpdates);

            const meRes = await API.getMe();

            const freshUser = meRes.data.user;

            setUser(freshUser);

            localStorage.setItem(
                STORAGE_KEYS.AUTH,
                JSON.stringify({
                    token,
                    user: freshUser,
                })
            );

            return true;
        } catch (err) {
            setError(
                err.response?.data?.message ??
                "Something went wrong while saving your profile."
            );
  
          console.log("FULL ERROR:", err.response);
          console.log("MESSAGE:", err.response?.data);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        profile,
        updateProfile,
        isSaving,
        error,
    };
}