import Http from "./Http";

export const API = {
    // AUTHS (LOGIN AND REGISTER)
    login: (data) => Http.post("/api/auth/login", data),
    register: (data) => Http.post("/api/auth/register", data),
    
    // USER
    getMe: () => Http.get("/api/user/me"),

    // USER PROFILE
    createUserProfile: (data) => Http.post("/api/user-profile/create-profile", data),
    updateUserProfile: (data) => Http.put("/api/user-profile/update-user", data),

    // SKILLS
    getallSkillSet: () => Http.get("/api/skills/skillsets"),
    createUserSkills: (data) => Http.post("/api/user-skills/create-skill", data),
    updateUserSkills: (data) => Http.put("/api/user-skills/update-skill", data),

    // JOBS
    getAllJobSkills: () => Http.get("/api/job/getAllJobTitle"),
    getJobsByJobTitle: (jobTitleId) => Http.get(`/api/jobs/title/${jobTitleId}`),

    // USER JOB SKILLS
    createUserJobTitle: (data) => Http.post("/api/user-job-title/create-user-jobtitle", data),

    // INTEREST
    getAllInterests: () => Http.get("/api/interest/get-interests"),
    createInterestAPI: (data) => Http.post("/api/interest/create-interest", data),
    createUserInterests: (data) => Http.post("/api/user-interest/create-user-interest", data),
    // Suggestion
    createSuggestionAPI: (data) => Http.post("/api/interest/suggest", data),

    // PROGRAM
    getAllPrograms: () => Http.get("/api/program/getProgram"),
    getProgramSkills: (programId) => Http.get(`/api/program/${programId}/skills`),
    getProgramInterests: (programId) => Http.get(`/api/program/${programId}/interests`),
    getProgramJobTitles: (programId) => Http.get(`/api/program/${programId}/jobtitles`),

    // AI RECOMMENDATION
    getAIRecommendation: (data) => Http.post("/api/ai/recommend", data),
    getCareerRecommendations: (data) => Http.post("/api/ai/recommend/careers", data),
    getLearningRecommendations: (data) => Http.post("/api/ai/recommend/learning", data),
    getSkillForecasts: (program_id, periods) => Http.get(`/api/trends/skills/forecast?program_id=${program_id}&periods=${periods}`),
    importJobsByJobTitle: (job_title_id) => Http.post(`/api/jobs/title/${job_title_id}/import`),
};

export default API;