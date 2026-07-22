import { UserProfile } from "../model/relation.js";

export async function createUserProfile(user_id, first_name, last_name, email, phone_number,birth_date, gender, bio, location) {
    try {
        const newUserProfile = await UserProfile.create({
            user_id,
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
            gender,
            bio,
            location,
        })

        return newUserProfile;
    }
    catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
}
export async function updateUserProfile(user_id, updates) {
    const profile = await UserProfile.findOne({
        where: { user_id }
    });

    if (!profile) throw new Error("User profile not found.");

    const clean = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        email: updates.email,
        phone_number: updates.phone_number,
        birth_date: updates.birth_date,
        gender: updates.gender,
        bio: updates.bio,
        location: updates.location,
    };

    return await profile.update(clean);
}