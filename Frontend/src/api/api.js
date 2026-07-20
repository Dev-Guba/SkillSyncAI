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

    // INTEREST
    createInterestAPI: (data) => Http.post("/api/interest/create-interest", data),
    // Suggestion
    createSuggestionAPI: (data) => Http.post("/api/interest/suggest",data),


}

export default API;