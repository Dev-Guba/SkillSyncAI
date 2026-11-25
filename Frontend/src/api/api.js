import Http from "./Http";

export const API = {
    // AUTHS (LOGIN, REGISTER, FORGOT PASSWORD & OTP)
    login: (data) => Http.post("/api/auth/login", data),
    register: (data) => Http.post("/api/auth/register", data),
    forgotPassword: (data) => Http.post("/api/auth/forgot-password", data),
    verifyOTP: (data) => Http.post("/api/auth/verify-otp", data),
    resetPassword: (data) => Http.post("/api/auth/reset-password", data),

    // CONTACT (landing page form, no login needed)
    sendContactMessage: (data) => Http.post("/api/contact", data),

    // USER
    getMe: () => Http.get("/api/user/me"),
    getAllUsers: () => Http.get("/api/user/all"),

    // ADMIN: ACCOUNT MANAGEMENT (admins only)
    adminListUsers: () => Http.get("/api/admin/users"),
    adminCreateUser: (data) => Http.post("/api/admin/users", data),
    adminChangeRole: (userId, role_id) =>
        Http.patch(`/api/admin/users/${userId}/role`, { role_id }),
    adminSetActive: (userId, active) =>
        Http.patch(`/api/admin/users/${userId}/status`, { active }),
    adminSendPasswordReset: (userId) =>
        Http.post(`/api/admin/users/${userId}/password-reset`),
    adminDeleteUser: (userId, confirm_username) =>
        Http.delete(`/api/admin/users/${userId}`, { data: { confirm_username } }),
    adminListActions: (limit = 30) =>
        Http.get(`/api/admin/users/actions?limit=${limit}`),

    // CURRICULUM ALIGNMENT (Objective 2.4)
    getProgramAlignment: (programId) => Http.get(`/api/curriculum/programs/${programId}`),
    adminCurriculumOverview: () => Http.get("/api/curriculum/overview"),
    adminReanalyzeJobSkills: () => Http.post("/api/admin/skill-candidates/reanalyze-jobs"),
    // Background collection of Cebu jobs for every program's careers
    adminRunScheduledImport: () => Http.post("/api/jobs/scheduled-import"),

    // ADMIN: EMERGING SKILLS FOUND IN JOB POSTINGS
    adminListSkillCandidates: (status = "pending") =>
        Http.get(`/api/admin/skill-candidates?status=${status}`),
    adminScanSkillCandidates: () => Http.post("/api/admin/skill-candidates/scan"),
    adminApproveSkillCandidate: (id, name) =>
        Http.post(`/api/admin/skill-candidates/${id}/approve`, { name }),
    adminMergeSkillCandidate: (id, skill_set_id) =>
        Http.post(`/api/admin/skill-candidates/${id}/merge`, { skill_set_id }),
    adminRejectSkillCandidate: (id) =>
        Http.post(`/api/admin/skill-candidates/${id}/reject`),
    adminReopenSkillCandidate: (id) =>
        Http.post(`/api/admin/skill-candidates/${id}/reopen`),

    // USER PROFILE
    createUserProfile: (data) => Http.post("/api/user-profile/create-profile", data),
    updateUserProfile: (data) => Http.put("/api/user-profile/update-user", data),
    updateProfilePicture: (profile_picture) =>
        Http.put("/api/user-profile/picture", { profile_picture }),

    // EMAIL VERIFICATION
    getEmailStatus: () => Http.get("/api/user-profile/email/status"),
    // email omitted = resend to the current email
    sendEmailCode: (email) =>
        Http.post("/api/user-profile/email/send-code", email ? { email } : {}),
    verifyEmailCode: (code) =>
        Http.post("/api/user-profile/email/verify", { code }),

    // SKILLS
    getallSkillSet: () => Http.get("/api/skills/skillsets"),
    createUserSkills: (data) => Http.post("/api/user-skills/create-skill", data),
    updateUserSkills: (data) => Http.put("/api/user-skills/update-skill", data),

    // Admin Skill Management
    createSkillSet: (data) => Http.post("/api/skills/skillsets", data),
    renameSkillSet: (skillId, data) =>
    Http.put(`/api/skills/skillsets/${skillId}`, data),

    // JOBS
    getAllJobSkills: () => Http.get("/api/job/getAllJobTitle"),
    getJobsByJobTitle: (jobTitleId) => Http.get(`/api/jobs/title/${jobTitleId}`),

    // USER JOB SKILLS
    createUserJobTitle: (data) => Http.post("/api/user-job-title/create-user-jobtitle", data),
    updateUserJobTitle: (data) => Http.put("/api/user-job-title/update-user-jobtitle", data),

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
    // The backend reuses jobs imported in the last 12 hours; force re-scrapes anyway
    importJobsByJobTitle: (job_title_id, { force = false } = {}) =>
        Http.post(`/api/jobs/title/${job_title_id}/import${force ? "?force=1" : ""}`),
};

export default API;