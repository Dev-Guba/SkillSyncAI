import UserJobTitle from "../model/UserJobTitle.js";

export async function createUserJobTitle(
    user_id,
    job_title_id
) {
    return await UserJobTitle.create({
        user_id,
        job_title_id
    });
}