import { getUserSkillsForAI } from "../services/UserSkillsServices.js";
import { getJobSkillsForAI } from "../services/jobTitleServices.js";
import { generateAIRecommendation } from "../services/ai.services.js";


export async function handleAIRecommendation(req,res){

    try {

        const {
            user_id,
            job_title_id
        } = req.body;


        // User's current skills
        const userSkillsData =
            await getUserSkillsForAI(user_id);


        const userSkills =
            userSkillsData.map(
                skill => skill.skill
            );


        // Job required skills
        const requiredSkills =
            await getJobSkillsForAI(job_title_id);



        const result =
            await generateAIRecommendation(
                userSkills,
                requiredSkills
            );


        res.json({
            success:true,
            data:result
        });


    } catch(error){

        console.error(
            "AI Recommendation Error:",
            error
        );


        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}