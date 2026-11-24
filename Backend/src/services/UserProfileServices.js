import { UserProfile } from "../model/relation.js";
import { normalizePhPhone, PHONE_ERROR } from "../utils/phone.js";

// The research runs only at UCLM, so every profile's school is fixed to it
// (whatever the request sends). Keep in sync with
// Frontend/src/data/cebuSchools.js.
export const RESEARCH_SCHOOL = "University of Cebu – Lapu-Lapu and Mandaue (UCLM)";

// Unselected dropdowns / empty date inputs arrive as "" — store them as null
// ("" isn't a valid gender for the ENUM column or a valid date).
const emptyToNull = (value) =>
    value === undefined || value === null || String(value).trim() === "" ? null : value;

// Empty -> null; a valid PH mobile -> "09XXXXXXXXX"; anything else -> 400
function cleanPhone(value) {
    if (value === undefined || value === null || String(value).trim() === "") {
        return null;
    }
    const phone = normalizePhPhone(value);
    if (!phone) {
        const error = new Error(PHONE_ERROR);
        error.status = 400;
        throw error;
    }
    return phone;
}
import {
    isEmailTaken,
    isEmailVerifiedForUser,
    normalizeEmail,
    sendVerificationCode,
} from "./emailVerificationServices.js";

export async function createUserProfile(
    user_id,
    first_name,
    last_name,
    school,
    email,
    phone_number,
    birth_date,
    gender,
    bio,
    location,
    program_id
) {
    try {
        const phone = cleanPhone(phone_number);

        if (await isEmailTaken(normalizeEmail(email), user_id)) {
            const error = new Error("That email is already used by another account.");
            error.status = 409;
            throw error;
        }

        const newUserProfile = await UserProfile.create({
            user_id,
            first_name,
            last_name,
            school: RESEARCH_SCHOOL,
            email: normalizeEmail(email),
            // Already confirmed at sign-up? Otherwise a code is sent next.
            email_verified_at: (await isEmailVerifiedForUser(user_id, email))
                ? new Date()
                : null,
            phone_number: phone,
            birth_date: emptyToNull(birth_date),
            gender: emptyToNull(gender),
            bio,
            location,
            program_id
        });

        return newUserProfile;

    } catch(error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
}

export async function updateUserProfile(user_id, updates) {
    const profile = await UserProfile.findOne({
        where: { user_id }
    });

    if (!profile) throw new Error("User profile not found.");

    // The email is NOT changed here. A different address gets a verification
    // code instead, and the profile switches to it only once the code is
    // entered (see emailVerificationServices.js). This stops someone with
    // brief access to an account from moving it to their own email.
    const clean = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        school: RESEARCH_SCHOOL,
        phone_number: cleanPhone(updates.phone_number),
        birth_date: emptyToNull(updates.birth_date),
        gender: emptyToNull(updates.gender),
        bio: updates.bio,
        location: updates.location,
    };

    // Handle the email first, so a rejected address (taken, invalid, email
    // couldn't be sent) doesn't leave the other fields half-saved.
    const requestedEmail = normalizeEmail(updates.email);
    let pending_email = null;

    if (requestedEmail && requestedEmail !== normalizeEmail(profile.email)) {
        const sent = await sendVerificationCode(user_id, requestedEmail);
        pending_email = sent.email;
    }

    const updated = await profile.update(clean);

    return { profile: updated, pending_email };
}

// ~600 KB of base64 is far more than a 256x256 JPEG needs.
const MAX_PICTURE_LENGTH = 600 * 1024;
const PICTURE_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;

export async function updateProfilePicture(user_id, picture) {
    const profile = await UserProfile.findOne({
        where: { user_id }
    });

    if (!profile) throw new Error("User profile not found.");

    // null or "" removes the picture
    if (picture) {
        if (typeof picture !== "string" || !PICTURE_PATTERN.test(picture)) {
            throw new Error("Profile picture must be a JPEG, PNG or WebP image.");
        }
        if (picture.length > MAX_PICTURE_LENGTH) {
            throw new Error("Profile picture is too large.");
        }
    }

    await profile.update({ profile_picture: picture || null });

    return { profile_picture: profile.profile_picture };
}