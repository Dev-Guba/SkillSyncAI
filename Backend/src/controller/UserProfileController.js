import { 
    createUserProfile,
    updateUserProfile,
 } from "../services/UserProfileServices.js";

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

export const handleUpdateUserProfile = async (req, res) => {
    try {
        console.log("🔥 RAW BODY:", req.body);
        console.log("🔥 RAW KEYS:", Object.keys(req.body || {}));
        const user_id = req.user.user_id;

        const profile = await updateUserProfile(user_id, req.body);

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            data: profile,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};