
import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock Sequelize operators and functions
jest.unstable_mockModule("sequelize", () => ({
    Op: {
        ne: Symbol.for("ne"),
        in: Symbol.for("in")
    },
    fn: jest.fn((...args) => ({ fn: args })),
    col: jest.fn((...args) => ({ col: args })),
    literal: jest.fn((value) => ({ literal: value }))
}));

// Mock models to prevent database initialization
jest.unstable_mockModule("../model/JobSkill.js", () => ({
    default: {
        findAll: jest.fn()
    }
}));

jest.unstable_mockModule("../model/Jobs.js", () => ({
    default: {}
}));

jest.unstable_mockModule("../model/SkillSet.js", () => ({
    default: {}
}));

jest.unstable_mockModule("../model/ProgramJobTitle.js", () => ({
    default: {
        findAll: jest.fn()
    }
}));

// Mock AI forecast service
jest.unstable_mockModule("../services/ai.services.js", () => ({
    forecastSkillDemand: jest.fn()
}));

const { Op } = await import("sequelize");

const JobSkill = (await import("../model/JobSkill.js")).default;
const ProgramJobTitle = (await import("../model/ProgramJobTitle.js")).default;

const { forecastSkillDemand } = await import("../services/ai.services.js");

const {
    getMonthlySkillDemand,
    getSkillTrends,
    getSkillForecasts
} = await import("../services/trendServices.js");


describe("trendServices alpha tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ==========================================
    // getMonthlySkillDemand()
    // ==========================================

    describe("getMonthlySkillDemand()", () => {

        test("AT-SA-001: should return monthly skill demand", async () => {

            const mockResults = [
                {
                    skill_set_id: 1,
                    skill: {
                        skill_set_name: "JavaScript"
                    },
                    get: jest.fn((key) => {
                        if (key === "month") return "2026-01";
                        if (key === "demand") return 15;
                    })
                }
            ];

            JobSkill.findAll.mockResolvedValue(mockResults);

            const result = await getMonthlySkillDemand();

            expect(JobSkill.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockResults);
        });


        test("AT-SA-002: should filter jobs by program ID", async () => {

            ProgramJobTitle.findAll.mockResolvedValue([
                { job_title_id: 1 },
                { job_title_id: 2 }
            ]);

            JobSkill.findAll.mockResolvedValue([]);

            await getMonthlySkillDemand(5);

            expect(ProgramJobTitle.findAll).toHaveBeenCalledWith({
                where: {
                    program_id: 5
                },
                attributes: ["job_title_id"],
                raw: true
            });

            const query = JobSkill.findAll.mock.calls[0][0];

            expect(query.include[0].where.job_title_id).toEqual({
                [Op.in]: [1, 2]
            });
        });


        test("AT-SA-003: should return an empty array when program has no related job titles", async () => {

            ProgramJobTitle.findAll.mockResolvedValue([]);

            const result = await getMonthlySkillDemand(999);

            expect(result).toEqual([]);
            expect(JobSkill.findAll).not.toHaveBeenCalled();
        });


        test("AT-SA-004: should return an empty array when no skill demand exists", async () => {

            JobSkill.findAll.mockResolvedValue([]);

            const result = await getMonthlySkillDemand();

            expect(result).toEqual([]);
        });


        test("AT-SA-005: should propagate database errors", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            JobSkill.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getMonthlySkillDemand()).rejects.toThrow(
                "Database error"
            );

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });

    });


    // ==========================================
    // getSkillTrends()
    // ==========================================

    describe("getSkillTrends()", () => {

        test("AT-SA-006: should calculate increasing skill demand", async () => {

            const mockData = [
                createMockRow("JavaScript", "2026-01", 10),
                createMockRow("JavaScript", "2026-02", 20)
            ];

            JobSkill.findAll.mockResolvedValue(mockData);

            const result = await getSkillTrends();

            expect(result).toHaveLength(1);

            expect(result[0]).toMatchObject({
                skill: "JavaScript",
                current_month: "2026-02",
                current_demand: 20,
                previous_month: "2026-01",
                previous_demand: 10,
                growth_percentage: 100,
                trend: "Increasing"
            });
        });


        test("AT-SA-007: should calculate decreasing skill demand", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("React", "2026-01", 20),
                createMockRow("React", "2026-02", 10)
            ]);

            const result = await getSkillTrends();

            expect(result[0].trend).toBe("Decreasing");
            expect(result[0].growth_percentage).toBe(-50);
        });


        test("AT-SA-008: should identify stable skill demand", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("MySQL", "2026-01", 15),
                createMockRow("MySQL", "2026-02", 15)
            ]);

            const result = await getSkillTrends();

            expect(result[0].trend).toBe("Stable");
            expect(result[0].growth_percentage).toBe(0);
        });


        test("AT-SA-009: should identify new skills with only one historical observation", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("Python", "2026-02", 12)
            ]);

            const result = await getSkillTrends();

            expect(result[0]).toMatchObject({
                skill: "Python",
                trend: "New",
                growth_percentage: null,
                previous_month: null,
                previous_demand: null
            });
        });


        test("AT-SA-010: should handle zero previous demand", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("Node.js", "2026-01", 0),
                createMockRow("Node.js", "2026-02", 10)
            ]);

            const result = await getSkillTrends();

            expect(result[0].trend).toBe("Increasing");
            expect(result[0].growth_percentage).toBeNull();
        });


        test("AT-SA-011: should skip records with missing skill names or months", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow(null, "2026-01", 10),
                createMockRow("React", null, 20),
                createMockRow("JavaScript", "2026-02", 15)
            ]);

            const result = await getSkillTrends();

            expect(result).toHaveLength(1);
            expect(result[0].skill).toBe("JavaScript");
        });


        test("AT-SA-012: should propagate errors from monthly skill demand", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            JobSkill.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getSkillTrends()).rejects.toThrow(
                "Database error"
            );

            consoleErrorSpy.mockRestore();
        });

    });


    // ==========================================
    // getSkillForecasts()
    // ==========================================

    describe("getSkillForecasts()", () => {

        test("AT-SA-013: should generate forecasts for skills with sufficient historical data", async () => {

            const history = [
                createMockRow("JavaScript", "2026-01", 10),
                createMockRow("JavaScript", "2026-02", 20)
            ];

            JobSkill.findAll.mockResolvedValue(history);

            const mockForecast = [
                { month: "2026-03", demand: 25 },
                { month: "2026-04", demand: 30 },
                { month: "2026-05", demand: 35 }
            ];

            forecastSkillDemand.mockResolvedValue(mockForecast);

            const result = await getSkillForecasts();

            expect(forecastSkillDemand).toHaveBeenCalledWith(
                [
                    { month: "2026-01", demand: 10 },
                    { month: "2026-02", demand: 20 }
                ],
                3
            );

            expect(result).toHaveLength(1);

            expect(result[0]).toMatchObject({
                skill: "JavaScript",
                forecast: mockForecast,
                status: "Forecast generated"
            });
        });


        test("AT-SA-014: should not generate forecasts with insufficient historical data", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("React", "2026-02", 15)
            ]);

            const result = await getSkillForecasts();

            expect(forecastSkillDemand).not.toHaveBeenCalled();

            expect(result[0]).toMatchObject({
                skill: "React",
                forecast: [],
                status: "Insufficient historical data"
            });
        });


        test("AT-SA-015: should return an empty array when no historical data exists", async () => {

            JobSkill.findAll.mockResolvedValue([]);

            const result = await getSkillForecasts();

            expect(result).toEqual([]);
            expect(forecastSkillDemand).not.toHaveBeenCalled();
        });


        test("AT-SA-016: should use the specified forecast periods", async () => {

            JobSkill.findAll.mockResolvedValue([
                createMockRow("Python", "2026-01", 10),
                createMockRow("Python", "2026-02", 15)
            ]);

            forecastSkillDemand.mockResolvedValue([]);

            await getSkillForecasts(6);

            expect(forecastSkillDemand).toHaveBeenCalledWith(
                [
                    { month: "2026-01", demand: 10 },
                    { month: "2026-02", demand: 15 }
                ],
                6
            );
        });


        test("AT-SA-017: should propagate forecast generation errors", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            JobSkill.findAll.mockResolvedValue([
                createMockRow("JavaScript", "2026-01", 10),
                createMockRow("JavaScript", "2026-02", 20)
            ]);

            forecastSkillDemand.mockRejectedValue(
                new Error("Forecast generation failed")
            );

            await expect(getSkillForecasts()).rejects.toThrow(
                "Forecast generation failed"
            );

            consoleErrorSpy.mockRestore();
        });


        test("AT-SA-018: should propagate database errors", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            JobSkill.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getSkillForecasts()).rejects.toThrow(
                "Database error"
            );

            consoleErrorSpy.mockRestore();
        });

    });

});


// ==========================================
// MOCK DATA HELPER
// ==========================================

function createMockRow(skillName, month, demand) {

    return {
        skill: skillName
            ? { skill_set_name: skillName }
            : null,

        get: jest.fn((key) => {

            if (key === "month") {
                return month;
            }

            if (key === "demand") {
                return demand;
            }

            return null;
        })
    };
}
