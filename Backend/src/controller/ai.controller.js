import { getUserSkillsForAI } from "../services/UserSkillsServices.js";
import { getJobSkillsForAI } from "../services/jobTitleServices.js";
import { generateAIRecommendation } from "../services/ai.services.js";
import { Op, fn, col, literal } from "sequelize";

import UserProfile from "../model/UserProfile.js"; 
import { recommendCareers, generateLearningRecommendations, extractJobSkills } from "../services/ai.services.js";

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

export async function getCareerRecommendations(req, res) {
    try {
        const { programId, userSkills } = req.body;

        if (!programId) {
            return res.status(400).json({
                success: false,
                message: "programId is required."
            });
        }

        if (!Array.isArray(userSkills)) {
            return res.status(400).json({
                success: false,
                message: "userSkills must be an array."
            });
        }

        const result = await recommendCareers(
            userSkills,
            programId
        );

        return res.status(200).json({
            success: true,
            data: result.data
        });

    } catch (error) {

        console.error(
            "Career Recommendation Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate career recommendations."
        });
    }
}

export async function getLearningRecommendations(
    req,
    res
) {
    try {

        const {
            job_title,
            missing_skills
        } = req.body;

        if (!job_title) {
            return res.status(400).json({
                success: false,
                message: "Job title is required."
            });
        }

        if (
            !Array.isArray(missing_skills) ||
            missing_skills.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing skills are required."
            });
        }

        const result =
            await generateLearningRecommendations(
                job_title,
                missing_skills
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Learning Recommendation Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate learning recommendations."
        });
    }
}

export async function extractSkillsFromJobs(
    req,
    res
) {
    try {

        const { jobs } = req.body;

        if (!jobs || !Array.isArray(jobs)) {
            return res.status(400).json({
                success: false,
                message: "Jobs must be provided as an array."
            });
        }

        const result =
            await extractJobSkills(jobs);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Extract Skills Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to extract job skills.",
            error: error.message
        });
    }
}