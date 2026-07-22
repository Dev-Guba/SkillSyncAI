import { createUserJobTitle } from "../services/UserJobTitle.js";

export async function createUserJobTitleController(req,res){

    try {

        const user_id = req.user.user_id;

        const { job_title_id } = req.body;

        const result = await createUserJobTitle(
            user_id,
            job_title_id
        );

        res.status(201).json({
            success:true,
            data:result
        });

    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }
}