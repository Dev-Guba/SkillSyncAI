import Http from "./Http";

export const API = {
    // AUTHS (LOGIN AND REGiSTER)
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

    // USER JOB SKILLS
    createUserJobTitle: (data) => Http.post("/api/user-job-title/create-user-jobtitle",data),

    // INTEREST
    createInterestAPI: (data) => Http.post("/api/interest/create-interest", data),
    // Suggestion
    createSuggestionAPI: (data) => Http.post("/api/interest/suggest",data),

    // AI RECOMMENDATION
    getAIRecommendation: (data) => Http.post("/api/ai/recommend", data),


}

export default API;