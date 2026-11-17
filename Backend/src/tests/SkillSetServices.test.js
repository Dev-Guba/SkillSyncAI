
import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock SkillSet model to prevent database initialization
jest.unstable_mockModule("../model/SkillSet.js", () => ({
    default: {
        findAll: jest.fn()
    }
}));

const SkillSet = (await import("../model/SkillSet.js")).default;

const {
    getAllSkillSets
} = await import("../services/skillSetServices.js");


describe("skillSetServices alpha tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ==========================================
    // getAllSkillSets()
    // ==========================================

    describe("getAllSkillSets()", () => {

        test("AT-SS-001: should return all skill sets", async () => {
            const mockSkillSets = [
                {
                    skill_set_id: 1,
                    skill_set_name: "JavaScript"
                },
                {
                    skill_set_id: 2,
                    skill_set_name: "React"
                },
                {
                    skill_set_id: 3,
                    skill_set_name: "MySQL"
                }
            ];

            SkillSet.findAll.mockResolvedValue(mockSkillSets);

            const result = await getAllSkillSets();

            expect(SkillSet.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockSkillSets);
        });


        test("AT-SS-002: should return an empty array when no skill sets exist", async () => {
            SkillSet.findAll.mockResolvedValue([]);

            const result = await getAllSkillSets();

            expect(SkillSet.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
        });


        test("AT-SS-003: should propagate database errors", async () => {
            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getAllSkillSets()).rejects.toThrow(
                "Database error"
            );

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error fetching skill sets:",
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });

    });

});
