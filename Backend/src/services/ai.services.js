import axios from "axios";

import Program from "../model/Program.js";
import JobTitle from "../model/JobTitle.js";
import SkillSet from "../model/SkillSet.js";

import { getAllSkillSets } from "./SkillSetServices.js";

const AI_URL =
"http://127.0.0.1:8000";

export async function generateAIRecommendation(
userSkills,
requiredSkills
) {

console.log(
    "===== AI REQUEST ====="
);

console.log(
    "User Skills:",
    userSkills
);

console.log(
    "Required Skills:",
    requiredSkills
);


const analysis =
    await axios.post(
        `${AI_URL}/analyze`,
        {
            user_skills: userSkills,
            required_skills: requiredSkills
        }
    );


const recommendation =
    await axios.post(
        `${AI_URL}/recommend`,
        {
            missing_skills:
                analysis.data.missing_skills
        }
    );


return {
    analysis: analysis.data,
    recommendation:
        recommendation.data
};

}

export async function fetchCebuJobs(
    keywords = "",
    location = "Cebu",
    limit = 50
) {
    try {

        console.log("===== FETCHING CEBU JOBS =====");
        console.log("Keywords:", keywords);

        const response = await axios.get(
            `${AI_URL}/cebu-jobs`,
            {
                params: {
                    keywords,
                    location,
                    limit
                }
            }
        );

        if (!response.data?.success) {
            throw new Error("Failed to fetch Cebu jobs");
        }

        const jobs = response.data.jobs || [];

        console.log(
            "Jobs received from FastAPI:",
            jobs.length
        );

        console.log(
            jobs.map(job => ({
                id: job.external_job_id,
                title: job.title
            }))
        );

        const processed =
            await extractJobSkills(jobs);

        console.log(
            `Processed ${
                processed.jobs?.length || 0
            } jobs with skills`
        );

        return processed.jobs || [];

    } catch (error) {

        console.error(
            "Cebu Jobs Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

export async function recommendCareers(userSkills, programId) {
    try {

        const program = await Program.findByPk(
            programId,
            {
                include: [
                    {
                        model: JobTitle,
                        include: [
                            {
                                model: SkillSet
                            }
                        ]
                    }
                ]
            }
        );

        if (!program) {
            throw new Error("Program not found.");
        }

        const careers = program.JobTitles.map(
            (jobTitle) => ({
                job_title_id:
                    jobTitle.job_title_id,

                job_title_name:
                    jobTitle.job_title_name,

                required_skills:
                    jobTitle.SkillSets.map(
                        (skill) =>
                            skill.skill_set_name
                    )
            })
        );

        console.log(
            "===== CAREERS FROM DATABASE ====="
        );

        console.log(
            JSON.stringify(
                careers,
                null,
                2
            )
        );

        const response = await axios.post(
            `${AI_URL}/recommend-careers`,
            {
                user_skills: userSkills,
                careers: careers
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI Career Recommendation Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

export async function generateLearningRecommendations(
    jobTitle,
    missingSkills
) {
    try {

        console.log(
            "===== LEARNING RECOMMENDATION ====="
        );

        console.log(
            "Job Title:",
            jobTitle
        );

        console.log(
            "Missing Skills:",
            missingSkills
        );

        const response = await axios.post(
            `${AI_URL}/learning-recommendations`,
            {
                job_title: jobTitle,
                missing_skills: missingSkills
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Learning Recommendation Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

export async function extractJobSkills(jobs) {

    try {

        const skillSets =
            await getAllSkillSets();

        const skillDictionary =
            skillSets.map(
                skill =>
                    skill.skill_set_name
            );

        console.log(
            "===== SKILL DICTIONARY ====="
        );

        console.log(
            skillDictionary
        );

        const response = await axios.post(
            `${AI_URL}/extract-job-skills`,
            {
                jobs,
                skill_dictionary:
                    skillDictionary
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Skill Extraction Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

export async function forecastSkillDemand(history, periods = 3) {
    try {
        const response = await axios.post(
            `${AI_URL}/forecast-skill`,
            {
                history,
                periods
            }
        );

        if (!response.data?.success) {
            throw new Error("Skill forecasting failed");
        }

        return response.data.forecast || [];

    } catch (error) {
        console.error(
            "Skill Forecasting Error:",
            error.response?.data || error.message
        );

        throw error;
    }
}