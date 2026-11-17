
import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock Program model to prevent database initialization
jest.unstable_mockModule("../model/Program.js", () => ({
    default: {
        findAll: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.unstable_mockModule("../model/relation.js", () => ({
    SkillSet: {},
    JobTitle: {}
}));

const Program = (await import("../model/Program.js")).default;

const {
    getAllPrograms,
    getProgramSkills,
    getProgramJobTitles
} = await import("../services/programServices.js");


describe("programServices alpha tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ==========================================
    // getAllPrograms()
    // ==========================================

    describe("getAllPrograms()", () => {

        test("AT-PS-001: should return all programs", async () => {
            const mockPrograms = [
                { program_id: 1, program_name: "BSIT" },
                { program_id: 2, program_name: "BSCS" }
            ];

            Program.findAll.mockResolvedValue(mockPrograms);

            const result = await getAllPrograms();

            expect(Program.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockPrograms);
        });

        test("AT-PS-002: should return an empty array when no programs exist", async () => {
            Program.findAll.mockResolvedValue([]);

            const result = await getAllPrograms();

            expect(result).toEqual([]);
        });

        test("AT-PS-003: should propagate database errors", async () => {
            Program.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getAllPrograms()).rejects.toThrow(
                "Database error"
            );
        });
    });


    // ==========================================
    // getProgramSkills()
    // ==========================================

    describe("getProgramSkills()", () => {

        test("AT-PS-004: should return skills for a valid program", async () => {
            const mockProgram = {
                program_id: 1,
                SkillSets: [
                    { skill_set_id: 1, skill_set_name: "javascript" },
                    { skill_set_id: 2, skill_set_name: "react" },
                    { skill_set_id: 3, skill_set_name: "mysql" }
                ]
            };

            Program.findOne.mockResolvedValue(mockProgram);

            const result = await getProgramSkills(1);

            expect(Program.findOne).toHaveBeenCalledWith({
                where: {
                    program_id: 1
                },
                include: [
                    {
                        model: SkillSet,
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            expect(result).toEqual(mockProgram.SkillSets);
        });

        test("AT-PS-005: should return an empty array when the program has no skills", async () => {
            Program.findOne.mockResolvedValue({
                program_id: 1,
                SkillSets: []
            });

            const result = await getProgramSkills(1);

            expect(result).toEqual([]);
        });

        test("AT-PS-006: should throw an error when the program does not exist", async () => {
            Program.findOne.mockResolvedValue(null);

            await expect(getProgramSkills(999)).rejects.toThrow(
                "Program not found"
            );
        });

        test("AT-PS-007: should propagate database errors", async () => {
            Program.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getProgramSkills(1)).rejects.toThrow(
                "Database error"
            );
        });
    });


    // ==========================================
    // getProgramJobTitles()
    // ==========================================

    describe("getProgramJobTitles()", () => {

        test("AT-PS-008: should return job titles for a valid program", async () => {
            const mockProgram = {
                program_id: 1,
                JobTitles: [
                    {
                        job_title_id: 1,
                        job_title_name: "Web Developer"
                    },
                    {
                        job_title_id: 2,
                        job_title_name: "Backend Developer"
                    }
                ]
            };

            Program.findOne.mockResolvedValue(mockProgram);

            const result = await getProgramJobTitles(1);

            expect(Program.findOne).toHaveBeenCalledWith({
                where: {
                    program_id: 1
                },
                include: [
                    {
                        model: JobTitle,
                        as: "JobTitles",
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            expect(result).toEqual(mockProgram.JobTitles);
        });

        test("AT-PS-009: should return an empty array when the program has no job titles", async () => {
            Program.findOne.mockResolvedValue({
                program_id: 1,
                JobTitles: []
            });

            const result = await getProgramJobTitles(1);

            expect(result).toEqual([]);
        });

        test("AT-PS-010: should throw an error when the program does not exist", async () => {
            Program.findOne.mockResolvedValue(null);

            await expect(getProgramJobTitles(999)).rejects.toThrow(
                "Program not found"
            );
        });

        test("AT-PS-011: should propagate database errors", async () => {
            Program.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getProgramJobTitles(1)).rejects.toThrow(
                "Database error"
            );
        });
    });

});
