import axios from "axios";

const AI_URL = "http://127.0.0.1:8000";


export async function generateAIRecommendation(
    userSkills,
    requiredSkills
) {


    const analysis = await axios.post(
        `${AI_URL}/analyze`,
        {
            user_skills: userSkills,
            required_skills: requiredSkills
        }
    );


    const recommendation = await axios.post(
        `${AI_URL}/recommend`,
        {
            missing_skills: analysis.data.missing_skills
        }
    );


    return {
        analysis: analysis.data,
        recommendation: recommendation.data
    };
}