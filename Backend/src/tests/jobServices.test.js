
import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
    afterEach
} from "@jest/globals";

// =========================================
// MOCK DEPENDENCIES
// =========================================

jest.unstable_mockModule("../model/Jobs.js", () => ({
    default: {
        findOrCreate: jest.fn(),
        findAll: jest.fn()
    }
}));

jest.unstable_mockModule("../model/SkillSet.js", () => ({
    default: {
        findOne: jest.fn()
    }
}));

jest.unstable_mockModule("../model/JobSkill.js", () => ({
    default: {
        destroy: jest.fn(),
        create: jest.fn()
    }
}));

jest.unstable_mockModule("../services/jobTitleServices.js", () => ({
    getJobTitleForJobs: jest.fn()
}));

jest.unstable_mockModule("../services/ai.services.js", () => ({
    fetchCebuJobs: jest.fn()
}));

// =========================================
// IMPORT MOCKED DEPENDENCIES
// =========================================

const Jobs = (await import("../model/Jobs.js")).default;
const SkillSet = (await import("../model/SkillSet.js")).default;
const JobSkill = (await import("../model/JobSkill.js")).default;

const { getJobTitleForJobs } =
    await import("../services/jobTitleServices.js");

const { fetchCebuJobs } =
    await import("../services/ai.services.js");

// Import actual service
const {
    saveJob,
    importJobs,
    importCebuJobs,
    fetchJobsByJobTitle,
    importJobsByJobTitle
} = await import("../services/jobServices.js");

// =========================================
// TEST DATA
// =========================================

const mockJobData = {
    job_title_id: 6,
    external_job_id: "JOB-001",
    title: "Web Developer",
    company: "ABC Technologies",
    location: "Cebu City",
    classification: "Information Technology",
    subclassification: "Software Development",
    description: "React and Node.js development",
    salary: "25000",
    employment_type: "Full-time",
    source: "JobStreet",
    posted_date: "2026-11-05",
    url: "https://example.com/job/001",
    skills: ["javascript", "react"]
};

const mockJob = {
    job_id: 1,
    ...mockJobData,
    update: jest.fn()
};

const mockJobTitle = {
    job_title_id: 6,
    job_title_name: "Web Developer"
};

// =========================================
// ALPHA TESTING
// =========================================

describe("Job Services - Alpha Testing", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});

        JobSkill.destroy.mockResolvedValue(1);
        JobSkill.create.mockResolvedValue({});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // =====================================
    // 1. saveJob()
    // =====================================

    describe("saveJob()", () => {

        test("AT-JOB-001: should successfully save a new job", async () => {

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            SkillSet.findOne
                .mockResolvedValueOnce({
                    skill_set_id: 1
                })
                .mockResolvedValueOnce({
                    skill_set_id: 2
                });

            const result = await saveJob(mockJobData);

            expect(result.job).toBe(mockJob);
            expect(result.created).toBe(true);

            expect(Jobs.findOrCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        external_job_id: "JOB-001"
                    }
                })
            );

            expect(JobSkill.create).toHaveBeenCalledTimes(2);
        });

        test("AT-JOB-002: should reject missing external_job_id", async () => {

            const invalidJob = {
                ...mockJobData,
                external_job_id: ""
            };

            await expect(
                saveJob(invalidJob)
            ).rejects.toThrow("external_job_id is required");

            expect(Jobs.findOrCreate).not.toHaveBeenCalled();
        });

        test("AT-JOB-003: should reject missing job title", async () => {

            const invalidJob = {
                ...mockJobData,
                title: ""
            };

            await expect(
                saveJob(invalidJob)
            ).rejects.toThrow("title is required");

            expect(Jobs.findOrCreate).not.toHaveBeenCalled();
        });

        test("AT-JOB-004: should reject missing source", async () => {

            const invalidJob = {
                ...mockJobData,
                source: ""
            };

            await expect(
                saveJob(invalidJob)
            ).rejects.toThrow("source is required");

            expect(Jobs.findOrCreate).not.toHaveBeenCalled();
        });

        test("AT-JOB-005: should update an existing job", async () => {

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                false
            ]);

            SkillSet.findOne
                .mockResolvedValueOnce({
                    skill_set_id: 1
                })
                .mockResolvedValueOnce({
                    skill_set_id: 2
                });

            const result = await saveJob(mockJobData);

            expect(result.created).toBe(false);
            expect(mockJob.update).toHaveBeenCalledTimes(1);
        });

        test("AT-JOB-006: should remove duplicate and normalize skills", async () => {

            const jobData = {
                ...mockJobData,
                skills: [
                    " JavaScript ",
                    "javascript",
                    "REACT",
                    " React "
                ]
            };

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            SkillSet.findOne
                .mockResolvedValueOnce({ skill_set_id: 1 })
                .mockResolvedValueOnce({ skill_set_id: 2 });

            await saveJob(jobData);

            expect(SkillSet.findOne).toHaveBeenCalledTimes(2);

            expect(SkillSet.findOne).toHaveBeenNthCalledWith(
                1,
                {
                    where: {
                        skill_set_name: "javascript"
                    }
                }
            );

            expect(SkillSet.findOne).toHaveBeenNthCalledWith(
                2,
                {
                    where: {
                        skill_set_name: "react"
                    }
                }
            );
        });

        test("AT-JOB-007: should skip skills not found in database", async () => {

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            SkillSet.findOne.mockResolvedValueOnce(null);

            await saveJob({
                ...mockJobData,
                skills: ["unknownskill"]
            });

            expect(JobSkill.create).not.toHaveBeenCalled();
        });

        test("AT-JOB-008: should handle an empty skills array", async () => {

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            await saveJob({
                ...mockJobData,
                skills: []
            });

            expect(JobSkill.destroy).toHaveBeenCalledWith({
                where: {
                    job_id: mockJob.job_id
                }
            });

            expect(JobSkill.create).not.toHaveBeenCalled();
        });

        test("AT-JOB-009: should skip skill processing when skills is not an array", async () => {

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            await saveJob({
                ...mockJobData,
                skills: null
            });

            expect(JobSkill.destroy).not.toHaveBeenCalled();
            expect(JobSkill.create).not.toHaveBeenCalled();
        });

        test("AT-JOB-010: should propagate database errors", async () => {

            Jobs.findOrCreate.mockRejectedValueOnce(
                new Error("Database error")
            );

            await expect(
                saveJob(mockJobData)
            ).rejects.toThrow("Database error");
        });

    });

    // =====================================
    // 2. importJobs()
    // =====================================

    describe("importJobs()", () => {

        test("AT-JOB-011: should import multiple jobs", async () => {

            const jobs = [
                mockJobData,
                {
                    ...mockJobData,
                    external_job_id: "JOB-002"
                }
            ];

            Jobs.findOrCreate
                .mockResolvedValueOnce([mockJob, true])
                .mockResolvedValueOnce([
                    { ...mockJob, job_id: 2 },
                    true
                ]);

            SkillSet.findOne.mockResolvedValue({
                skill_set_id: 1
            });

            const result = await importJobs(jobs);

            expect(result).toHaveLength(2);
            expect(Jobs.findOrCreate).toHaveBeenCalledTimes(2);
        });

        test("AT-JOB-012: should return an empty array for empty input", async () => {

            const result = await importJobs([]);

            expect(result).toEqual([]);
            expect(Jobs.findOrCreate).not.toHaveBeenCalled();
        });

        test("AT-JOB-013: should reject non-array input", async () => {

            await expect(
                importJobs(null)
            ).rejects.toThrow("Jobs must be an array");

            expect(Jobs.findOrCreate).not.toHaveBeenCalled();
        });

        test("AT-JOB-014: should reject when a job import fails", async () => {

            Jobs.findOrCreate
                .mockResolvedValueOnce([mockJob, true])
                .mockRejectedValueOnce(
                    new Error("Job import failed")
                );

            SkillSet.findOne.mockResolvedValue({
                skill_set_id: 1
            });

            await expect(
                importJobs([
                    mockJobData,
                    {
                        ...mockJobData,
                        external_job_id: "JOB-002"
                    }
                ])
            ).rejects.toThrow("Job import failed");
        });

    });

    // =====================================
    // 3. importCebuJobs()
    // =====================================

    describe("importCebuJobs()", () => {

        test("AT-JOB-015: should fetch and import Cebu jobs", async () => {

            fetchCebuJobs.mockResolvedValueOnce([
                mockJobData
            ]);

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            SkillSet.findOne.mockResolvedValue({
                skill_set_id: 1
            });

            const result = await importCebuJobs();

            expect(fetchCebuJobs).toHaveBeenCalledTimes(1);

            expect(result.count).toBe(1);
            expect(result.results).toHaveLength(1);
        });

        test("AT-JOB-016: should return zero when no Cebu jobs are available", async () => {

            fetchCebuJobs.mockResolvedValueOnce([]);

            const result = await importCebuJobs();

            expect(result.count).toBe(0);
            expect(result.results).toEqual([]);
        });

        test("AT-JOB-017: should propagate Cebu job fetching errors", async () => {

            fetchCebuJobs.mockRejectedValueOnce(
                new Error("Cebu job fetching failed")
            );

            await expect(
                importCebuJobs()
            ).rejects.toThrow("Cebu job fetching failed");
        });

    });

    // =====================================
    // 4. fetchJobsByJobTitle()
    // =====================================

    describe("fetchJobsByJobTitle()", () => {

        test("AT-JOB-018: should retrieve jobs by job title", async () => {

            const jobs = [
                mockJob
            ];

            getJobTitleForJobs.mockResolvedValueOnce(
                mockJobTitle
            );

            Jobs.findAll.mockResolvedValueOnce(jobs);

            const result = await fetchJobsByJobTitle(6);

            expect(result.job_title_id).toBe(6);
            expect(result.job_title_name).toBe("Web Developer");
            expect(result.count).toBe(1);
            expect(result.jobs).toEqual(jobs);

            expect(Jobs.findAll).toHaveBeenCalledWith({
                where: {
                    job_title_id: 6
                },
                order: [
                    ["posted_date", "DESC"]
                ]
            });
        });

        test("AT-JOB-019: should return empty jobs when none exist", async () => {

            getJobTitleForJobs.mockResolvedValueOnce(
                mockJobTitle
            );

            Jobs.findAll.mockResolvedValueOnce([]);

            const result = await fetchJobsByJobTitle(6);

            expect(result.count).toBe(0);
            expect(result.jobs).toEqual([]);
        });

        test("AT-JOB-020: should propagate job title lookup errors", async () => {

            getJobTitleForJobs.mockRejectedValueOnce(
                new Error("Job title not found")
            );

            await expect(
                fetchJobsByJobTitle(999)
            ).rejects.toThrow("Job title not found");

            expect(Jobs.findAll).not.toHaveBeenCalled();
        });

    });

    // =====================================
    // 5. importJobsByJobTitle()
    // =====================================

    describe("importJobsByJobTitle()", () => {

        test("AT-JOB-021: should import jobs for a specific job title", async () => {

            getJobTitleForJobs.mockResolvedValueOnce(
                mockJobTitle
            );

            fetchCebuJobs.mockResolvedValueOnce([
                {
                    ...mockJobData,
                    external_job_id: "JOB-003"
                }
            ]);

            Jobs.findOrCreate.mockResolvedValueOnce([
                mockJob,
                true
            ]);

            SkillSet.findOne.mockResolvedValue({
                skill_set_id: 1
            });

            const result = await importJobsByJobTitle(6);

            expect(fetchCebuJobs).toHaveBeenCalledWith(
                "Web Developer"
            );

            expect(result.job_title_id).toBe(6);
            expect(result.job_title_name).toBe("Web Developer");
            expect(result.count).toBe(1);
        });

        test("AT-JOB-022: should return zero when no jobs match the title", async () => {

            getJobTitleForJobs.mockResolvedValueOnce(
                mockJobTitle
            );

            fetchCebuJobs.mockResolvedValueOnce([]);

            const result = await importJobsByJobTitle(6);

            expect(result.count).toBe(0);
            expect(result.results).toEqual([]);
        });

        test("AT-JOB-023: should propagate job fetching errors", async () => {

            getJobTitleForJobs.mockResolvedValueOnce(
                mockJobTitle
            );

            fetchCebuJobs.mockRejectedValueOnce(
                new Error("Job fetching failed")
            );

            await expect(
                importJobsByJobTitle(6)
            ).rejects.toThrow("Job fetching failed");
        });

    });

});
