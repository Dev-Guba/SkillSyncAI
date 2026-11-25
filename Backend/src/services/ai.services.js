import axios from "axios";

import Program from "../model/Program.js";
import JobTitle from "../model/JobTitle.js";
import SkillSet from "../model/SkillSet.js";

import { getAllSkillSets } from "./SkillSetServices.js";
import { getSkillAliases } from "./skillDiscoveryServices.js";

const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

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

/*
| Learning plans come from Gemini, which can take minutes (or fail) when it is
| busy. The same job title + missing skills always asks the same question, so
| successful answers are kept in memory for a day and reused. Requests that
| arrive while the same plan is already being generated wait for that one
| instead of starting another. The cache is cleared when the server restarts.
*/
const LEARNING_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LEARNING_CACHE_MAX = 200;
// The AI service tries several Gemini models within ~45s, so allow a bit more
// (the page shows quick learning links while it waits)
const LEARNING_TIMEOUT_MS = 55 * 1000;

const learningCache = new Map(); // key -> { value, expires }
const learningInFlight = new Map(); // key -> Promise

function learningCacheKey(jobTitle, missingSkills) {
    const skills = [...new Set(
        missingSkills.map((s) => String(s).trim().toLowerCase())
    )].sort();
    return `${String(jobTitle).trim().toLowerCase()}|${skills.join(",")}`;
}

// When Gemini says the API quota is used up, skip calling it for a while so
// pages get an instant answer (and show quick links) instead of waiting.
const QUOTA_PAUSE_MS = 10 * 60 * 1000;
let quotaPausedUntil = 0;

export async function generateLearningRecommendations(
    jobTitle,
    missingSkills
) {
    if (Date.now() < quotaPausedUntil) {
        const error = new Error("The Gemini API quota is used up for now.");
        error.code = "AI_QUOTA";
        throw error;
    }

    const key = learningCacheKey(jobTitle, missingSkills);

    const cached = learningCache.get(key);
    if (cached && cached.expires > Date.now()) {
        console.log("Learning recommendation served from cache:", jobTitle);
        return cached.value;
    }

    if (learningInFlight.has(key)) {
        return learningInFlight.get(key);
    }

    const request = requestLearningRecommendations(jobTitle, missingSkills)
        .then((value) => {
            if (learningCache.size >= LEARNING_CACHE_MAX) {
                // drop the oldest entry
                learningCache.delete(learningCache.keys().next().value);
            }
            learningCache.set(key, {
                value,
                expires: Date.now() + LEARNING_CACHE_TTL_MS,
            });
            return value;
        })
        .finally(() => {
            learningInFlight.delete(key);
        });

    learningInFlight.set(key, request);
    return request;
}

async function requestLearningRecommendations(
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
            },
            { timeout: LEARNING_TIMEOUT_MS }
        );

        // The AI service reports Gemini failures as { success: false } with HTTP 200
        if (response.data?.success === false) {
            const message = response.data.message || "The AI service could not create a learning plan.";
            const error = new Error(message);
            if (/quota|429|RESOURCE_EXHAUSTED/i.test(message)) {
                quotaPausedUntil = Date.now() + QUOTA_PAUSE_MS;
                error.code = "AI_QUOTA";
            }
            throw error;
        }

        return response.data;

    } catch (error) {

        if (error.code === "ECONNABORTED") {
            error.message =
                "The AI took too long to respond. Please try again in a few minutes.";
        }

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

        // Catalog names plus spellings an admin merged into a catalog skill
        // (e.g. "reactjs" -> React); jobServices maps those back to the skill.
        const aliases = await getSkillAliases();

        const skillDictionary = [
            ...skillSets.map(
                skill =>
                    skill.skill_set_name
            ),
            ...aliases.map((a) => a.term),
        ];

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

/*
| TF-IDF + cosine similarity between a program's curriculum and its job
| market (AI service /curriculum-similarity). Returns null if the AI service
| can't answer, so the curriculum page still works without it.
*/
export async function curriculumSimilarity(programSkills, marketDemand) {
    try {
        const response = await axios.post(
            `${AI_URL}/curriculum-similarity`,
            { program_skills: programSkills, market_demand: marketDemand },
            { timeout: 15 * 1000 }
        );
        const value = response.data?.cosine_similarity;
        return typeof value === "number" ? value : null;
    } catch (error) {
        console.error("Curriculum similarity error:", error.response?.status || error.message);
        return null;
    }
}

export async function forecastSkillDemand(history, periods = 36) {
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