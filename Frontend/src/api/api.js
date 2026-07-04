import Http from "./Http";

export const API = {
    login: (data) => Http.post("/api/auth/login", data),
    register: (data) => Http.post("/api/auth/register", data),
    // getUsers: () => Http.get("/api/users"),
}

export default API;