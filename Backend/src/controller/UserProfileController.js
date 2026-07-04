import { createUserProfile } from "../services/UserProfileServices.js";

export async function createProfile(req, res) {
    try {
        const {
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
            gender,
            bio,
            location,
        } = req.body;

        const user_id = req.user.user_id;


        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const newUserProfile = await createUserProfile(
            user_id,
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
            gender,
            bio,
            location
        );

        return res.status(201).json({
            success: true,
            message: "User profile created successfully",
            userProfile: newUserProfile,
        });

    } catch (error) {
        console.error("CHECKING THE REQUEST BODY: ", req.body);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}