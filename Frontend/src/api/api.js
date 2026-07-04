import { data } from "react-router-dom";
import Http from "./Http";

export const API = {
    // AUTHS (LOGIN AND REGiSTER)
    login: (data) => Http.post("/api/auth/login", data),
    register: (data) => Http.post("/api/auth/register", data),
    
    // USER PROFILE
    createUserProfile: (data) => Http.post("/api/user-profile/create-profile", data),

    // SKILLS
    getallSkillSet: () => Http.get("/api/skills/skillsets"),
    createUserSkills: (data) => Http.post("/api/user-skills/create-skill", data),

}

export default API;