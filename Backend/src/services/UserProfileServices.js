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
        console.log(req.body);
        throw error;
    }
}