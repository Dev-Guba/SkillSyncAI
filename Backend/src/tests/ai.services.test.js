import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

// Mock Axios
jest.unstable_mockModule("axios", () => ({
    default: {
        post: jest.fn(),
        get: jest.fn()
    }
}));

// Mock Sequelize models
jest.unstable_mockModule("../model/Program.js", () => ({
    default: {
        findByPk: jest.fn()
    }
}));

jest.unstable_mockModule("../model/JobTitle.js", () => ({
    default: {}
}));

jest.unstable_mockModule("../model/SkillSet.js", () => ({
    default: {}
}));

// Mock SkillSet service
jest.unstable_mockModule("../services/SkillSetServices.js", () => ({
    getAllSkillSets: jest.fn()
}));

// Import mocked dependencies AFTER registering mocks
const axios = (await import("axios")).default;

const Program = (await import("../model/Program.js")).default;

const { getAllSkillSets } =
    await import("../services/SkillSetServices.js");

// Import actual service under test
const {
    generateAIRecommendation,
    fetchCebuJobs,
    recommendCareers,
    generateLearningRecommendations,
    extractJobSkills,
    forecastSkillDemand
} = await import("../services/ai.services.js");

describe("AI Services - Alpha Testing", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // =========================================
    // 1. generateAIRecommendation()
    // =========================================

    describe("generateAIRecommendation()", () => {

        test("AT-AI-001: should generate skill gap analysis and recommendations", async () => {

            const analysis = {
                match_percentage: 75,
                matched_skills: ["javascript", "react"],
                missing_skills: ["node.js"]
            };

            const recommendation = {
                recommendations: [
                    {
                        skill: "node.js",
                        description: "Learn backend development"
                    }
                ]
            };

            axios.post
                .mockResolvedValueOnce({ data: analysis })
                .mockResolvedValueOnce({ data: recommendation });

            const result = await generateAIRecommendation(
                ["javascript", "react"],
                ["javascript", "react", "node.js"]
            );

            expect(result.analysis).toEqual(analysis);
            expect(result.recommendation).toEqual(recommendation);

            expect(axios.post).toHaveBeenCalledTimes(2);
        });

        test("AT-AI-002: should propagate AI analysis errors", async () => {

            axios.post.mockRejectedValueOnce(
                new Error("AI server unavailable")
            );

            await expect(
                generateAIRecommendation(["react"], ["node.js"])
            ).rejects.toThrow("AI server unavailable");
        });

        test("AT-AI-003: should propagate recommendation errors", async () => {

            axios.post
                .mockResolvedValueOnce({
                    data: { missing_skills: ["node.js"] }
                })
                .mockRejectedValueOnce(
                    new Error("Recommendation failed")
                );

            await expect(
                generateAIRecommendation(["react"], ["react", "node.js"])
            ).rejects.toThrow("Recommendation failed");
        });
    });

    // =========================================
    // 2. fetchCebuJobs()
    // =========================================

    describe("fetchCebuJobs()", () => {

        test("AT-AI-004: should fetch and process Cebu jobs", async () => {

            const jobs = [
                {
                    external_job_id: "JOB-001",
                    title: "Web Developer"
                }
            ];

            const processedJobs = [
                {
                    external_job_id: "JOB-001",
                    title: "Web Developer",
                    skills: ["javascript", "react"]
                }
            ];

            axios.get.mockResolvedValueOnce({
                data: {
                    success: true,
                    jobs
                }
            });

            getAllSkillSets.mockResolvedValueOnce([
                { skill_set_name: "javascript" },
                { skill_set_name: "react" }
            ]);

            axios.post.mockResolvedValueOnce({
                data: { jobs: processedJobs }
            });

            const result = await fetchCebuJobs();

            expect(result).toEqual(processedJobs);

            expect(axios.get).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/cebu-jobs",
                {
                    params: {
                        keywords: "",
                        location: "Cebu",
                        limit: 50
                    }
                }
            );
        });

        test("AT-AI-005: should return an empty array when no jobs are found", async () => {

            axios.get.mockResolvedValueOnce({
                data: {
                    success: true,
                    jobs: []
                }
            });

            getAllSkillSets.mockResolvedValueOnce([]);

            axios.post.mockResolvedValueOnce({
                data: { jobs: [] }
            });

            const result = await fetchCebuJobs();

            expect(result).toEqual([]);
        });

        test("AT-AI-006: should throw an error when job fetching fails", async () => {

            axios.get.mockResolvedValueOnce({
                data: {
                    success: false,
                    jobs: []
                }
            });

            await expect(
                fetchCebuJobs()
            ).rejects.toThrow("Failed to fetch Cebu jobs");
        });

        test("AT-AI-007: should propagate skill extraction errors", async () => {

            axios.get.mockResolvedValueOnce({
                data: {
                    success: true,
                    jobs: [{ title: "Developer" }]
                }
            });

            getAllSkillSets.mockRejectedValueOnce(
                new Error("Database error")
            );

            await expect(
                fetchCebuJobs()
            ).rejects.toThrow("Database error");
        });
    });

    // =========================================
    // 3. recommendCareers()
    // =========================================

    describe("recommendCareers()", () => {

        test("AT-AI-008: should generate career recommendations", async () => {

            Program.findByPk.mockResolvedValueOnce({
                JobTitles: [
                    {
                        job_title_id: 6,
                        job_title_name: "Web Developer",
                        SkillSets: [
                            { skill_set_name: "javascript" },
                            { skill_set_name: "react" }
                        ]
                    }
                ]
            });

            const aiResponse = {
                recommendations: [
                    {
                        job_title_id: 6,
                        match_percentage: 85
                    }
                ]
            };

            axios.post.mockResolvedValueOnce({
                data: aiResponse
            });

            const result = await recommendCareers(
                ["javascript", "react"],
                1
            );

            expect(result).toEqual(aiResponse);

            expect(Program.findByPk).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    include: expect.any(Array)
                })
            );

            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        test("AT-AI-009: should throw an error when program does not exist", async () => {

            Program.findByPk.mockResolvedValueOnce(null);

            await expect(
                recommendCareers(["javascript"], 999)
            ).rejects.toThrow("Program not found.");

            expect(axios.post).not.toHaveBeenCalled();
        });

        test("AT-AI-010: should propagate AI recommendation errors", async () => {

            Program.findByPk.mockResolvedValueOnce({
                JobTitles: []
            });

            axios.post.mockRejectedValueOnce(
                new Error("AI recommendation unavailable")
            );

            await expect(
                recommendCareers(["javascript"], 1)
            ).rejects.toThrow("AI recommendation unavailable");
        });
    });

    // =========================================
    // 4. generateLearningRecommendations()
    // =========================================

    describe("generateLearningRecommendations()", () => {

        test("AT-AI-011: should generate learning recommendations", async () => {

            const learningData = {
                recommendations: [
                    {
                        skill: "node.js",
                        description: "Backend development fundamentals"
                    }
                ]
            };

            axios.post.mockResolvedValueOnce({
                data: learningData
            });

            const result = await generateLearningRecommendations(
                "Web Developer",
                ["node.js"]
            );

            expect(result).toEqual(learningData);

            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/learning-recommendations",
                {
                    job_title: "Web Developer",
                    missing_skills: ["node.js"]
                }
            );
        });

        test("AT-AI-012: should propagate learning recommendation errors", async () => {

            axios.post.mockRejectedValueOnce(
                new Error("Learning service unavailable")
            );

            await expect(
                generateLearningRecommendations(
                    "Web Developer",
                    ["node.js"]
                )
            ).rejects.toThrow("Learning service unavailable");
        });
    });

    // =========================================
    // 5. extractJobSkills()
    // =========================================

    describe("extractJobSkills()", () => {

        test("AT-AI-013: should extract skills from job listings", async () => {

            const jobs = [
                {
                    title: "React Developer"
                }
            ];

            const extractedData = {
                jobs: [
                    {
                        title: "React Developer",
                        skills: ["react", "javascript"]
                    }
                ]
            };

            getAllSkillSets.mockResolvedValueOnce([
                { skill_set_name: "react" },
                { skill_set_name: "javascript" }
            ]);

            axios.post.mockResolvedValueOnce({
                data: extractedData
            });

            const result = await extractJobSkills(jobs);

            expect(result).toEqual(extractedData);

            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/extract-job-skills",
                {
                    jobs,
                    skill_dictionary: ["react", "javascript"]
                }
            );
        });

        test("AT-AI-014: should handle an empty skill dictionary", async () => {

            getAllSkillSets.mockResolvedValueOnce([]);

            axios.post.mockResolvedValueOnce({
                data: { jobs: [] }
            });

            const result = await extractJobSkills([]);

            expect(result).toEqual({ jobs: [] });

            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/extract-job-skills",
                {
                    jobs: [],
                    skill_dictionary: []
                }
            );
        });

        test("AT-AI-015: should propagate skill extraction errors", async () => {

            getAllSkillSets.mockResolvedValueOnce([
                { skill_set_name: "javascript" }
            ]);

            axios.post.mockRejectedValueOnce(
                new Error("Extraction service failed")
            );

            await expect(
                extractJobSkills([])
            ).rejects.toThrow("Extraction service failed");
        });
    });

    // =========================================
    // 6. forecastSkillDemand()
    // =========================================

    describe("forecastSkillDemand()", () => {

        test("AT-AI-016: should return skill demand forecasts", async () => {

            const forecast = [
                {
                    skill: "javascript",
                    predicted_demand: 120
                }
            ];

            axios.post.mockResolvedValueOnce({
                data: {
                    success: true,
                    forecast
                }
            });

            const result = await forecastSkillDemand(
                [{ skill: "javascript", demand: 100 }]
            );

            expect(result).toEqual(forecast);

            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/forecast-skill",
                {
                    history: [
                        { skill: "javascript", demand: 100 }
                    ],
                    periods: 3
                }
            );
        });

        test("AT-AI-017: should return an empty array when forecast is missing", async () => {

            axios.post.mockResolvedValueOnce({
                data: {
                    success: true
                }
            });

            const result = await forecastSkillDemand([]);

            expect(result).toEqual([]);
        });

        test("AT-AI-018: should throw an error when forecasting fails", async () => {

            axios.post.mockResolvedValueOnce({
                data: {
                    success: false
                }
            });

            await expect(
                forecastSkillDemand([])
            ).rejects.toThrow("Skill forecasting failed");
        });

        test("AT-AI-019: should propagate AI server errors", async () => {

            axios.post.mockRejectedValueOnce(
                new Error("Forecast server unavailable")
            );

            await expect(
                forecastSkillDemand([])
            ).rejects.toThrow("Forecast server unavailable");
        });
    });

});
