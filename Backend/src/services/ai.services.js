import axios from "axios";

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

console.log(
    "===== FETCHING CEBU JOBS ====="
);

console.log(
    "Keywords:",
    keywords
);


const response =
    await axios.get(
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

    throw new Error(
        "Failed to fetch Cebu jobs"
    );

}


console.log(
    `Fetched ${
        response.data.jobs?.length || 0
    } jobs`
);


return response.data.jobs || [];

}