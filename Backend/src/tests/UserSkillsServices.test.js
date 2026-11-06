import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock database connection
jest.unstable_mockModule("../config/db.js", () => ({
    default: {
        transaction: jest.fn()
    }
}));

// Mock models to prevent database initialization
jest.unstable_mockModule("../model/relation.js", () => ({
    User: {
        findByPk: jest.fn()
    },
    UserSkill: {
        bulkCreate: jest.fn(),
        destroy: jest.fn(),
        findAll: jest.fn()
    },
    SkillSet: {
        findAll: jest.fn()
    }
}));

const sequelize = (await import("../config/db.js")).default;

const {
    User,
    UserSkill,
    SkillSet
} = await import("../model/relation.js");

// NOTE: adjust this path to match your actual service file name
const {
    getUserSkillsForAI,
    formatSkillsForAI,
    createUserSkills,
    updateUserSkills
} = await import("../services/UserSkillsServices.js");


describe("UserSkillsServices alpha tests", () => {

    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockTransaction = {
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined)
        };

        sequelize.transaction.mockResolvedValue(mockTransaction);
    });


    // ==========================================
    // getUserSkillsForAI()
    // ==========================================

    describe("getUserSkillsForAI()", () => {

        test("AT-SK-001: should return the user's skills with proficiency levels", async () => {

            User.findByPk.mockResolvedValue({
                SkillSets: [
                    {
                        skill_set_name: "JavaScript",
                        UserSkill: { proficiency_level: "Advanced" }
                    },
                    {
                        skill_set_name: "SQL",
                        UserSkill: { proficiency_level: "Beginner" }
                    }
                ]
            });

            const result = await getUserSkillsForAI(1);

            expect(result).toEqual([
                { skill: "JavaScript", proficiency: "Advanced" },
                { skill: "SQL", proficiency: "Beginner" }
            ]);
        });


        test("AT-SK-002: should query the user by primary key with skill associations", async () => {

            User.findByPk.mockResolvedValue({ SkillSets: [] });

            await getUserSkillsForAI(7);

            expect(User.findByPk).toHaveBeenCalledTimes(1);

            const [userId, query] = User.findByPk.mock.calls[0];

            expect(userId).toBe(7);
            expect(query.include[0].model).toBe(SkillSet);
            expect(query.include[0].attributes).toEqual(["skill_set_name"]);
            expect(query.include[0].through).toEqual({
                attributes: ["proficiency_level"]
            });
        });


        test("AT-SK-003: should return an empty array when the user has no skills", async () => {

            User.findByPk.mockResolvedValue({ SkillSets: [] });

            const result = await getUserSkillsForAI(1);

            expect(result).toEqual([]);
        });


        test("AT-SK-004: should throw an error when the user does not exist", async () => {

            User.findByPk.mockResolvedValue(null);

            await expect(getUserSkillsForAI(999)).rejects.toThrow(
                "User not found"
            );
        });


        test("AT-SK-005: should propagate database errors", async () => {

            User.findByPk.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getUserSkillsForAI(1)).rejects.toThrow(
                "Database error"
            );
        });

    });


    // ==========================================
    // formatSkillsForAI()
    // ==========================================

    describe("formatSkillsForAI()", () => {

        test("AT-SK-006: should return an array of skill names", () => {

            const result = formatSkillsForAI([
                { skill_set_name: "JavaScript" },
                { skill_set_name: "Python" }
            ]);

            expect(result).toEqual(["JavaScript", "Python"]);
        });


        test("AT-SK-007: should return an empty array for empty input", () => {

            expect(formatSkillsForAI([])).toEqual([]);
        });

    });


    // ==========================================
    // createUserSkills()
    // ==========================================

    describe("createUserSkills()", () => {

        test("AT-SK-008: should create user skills with valid input", async () => {

            const skills = [
                { skill_set_id: 1, proficiency_level: "Beginner" },
                { skill_set_id: 2, proficiency_level: "Advanced" }
            ];

            const created = [{ id: 1 }, { id: 2 }];

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.bulkCreate.mockResolvedValue(created);

            const result = await createUserSkills(5, skills);

            expect(result).toEqual(created);
        });


        test("AT-SK-009: should map skills to user skill records", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.bulkCreate.mockResolvedValue([]);

            await createUserSkills(5, [
                { skill_set_id: 1, proficiency_level: "Beginner" },
                { skill_set_id: 2, proficiency_level: "Intermediate" }
            ]);

            expect(UserSkill.bulkCreate).toHaveBeenCalledWith([
                { user_id: 5, skill_set_id: 1, proficiency_level: "Beginner" },
                { user_id: 5, skill_set_id: 2, proficiency_level: "Intermediate" }
            ]);
        });


        test("AT-SK-010: should verify that all skill IDs exist", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.bulkCreate.mockResolvedValue([]);

            await createUserSkills(5, [
                { skill_set_id: 1, proficiency_level: "Beginner" },
                { skill_set_id: 2, proficiency_level: "Beginner" }
            ]);

            expect(SkillSet.findAll).toHaveBeenCalledWith({
                where: {
                    skill_set_id: [1, 2]
                }
            });
        });


        test("AT-SK-011: should accept all valid proficiency levels", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}, {}]);
            UserSkill.bulkCreate.mockResolvedValue([]);

            await expect(
                createUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Beginner" },
                    { skill_set_id: 2, proficiency_level: "Intermediate" },
                    { skill_set_id: 3, proficiency_level: "Advanced" }
                ])
            ).resolves.toBeDefined();
        });


        test("AT-SK-012: should reject an empty skills array", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(createUserSkills(5, [])).rejects.toThrow(
                "Please provide at least one skill."
            );

            expect(SkillSet.findAll).not.toHaveBeenCalled();
            expect(UserSkill.bulkCreate).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-013: should reject skills that are not an array", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(createUserSkills(5, null)).rejects.toThrow(
                "Please provide at least one skill."
            );

            await expect(
                createUserSkills(5, { skill_set_id: 1 })
            ).rejects.toThrow("Please provide at least one skill.");

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-014: should reject duplicate skills", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(
                createUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Beginner" },
                    { skill_set_id: 1, proficiency_level: "Advanced" }
                ])
            ).rejects.toThrow("Duplicate skills are not allowed.");

            expect(UserSkill.bulkCreate).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-015: should reject an invalid proficiency level", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(
                createUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Expert" }
                ])
            ).rejects.toThrow("Invalid proficiency level: Expert");

            expect(UserSkill.bulkCreate).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-016: should reject a missing proficiency level", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(
                createUserSkills(5, [{ skill_set_id: 1 }])
            ).rejects.toThrow("Invalid proficiency level: undefined");

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-017: should reject skills that do not exist", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockResolvedValue([{}]);

            await expect(
                createUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Beginner" },
                    { skill_set_id: 999, proficiency_level: "Beginner" }
                ])
            ).rejects.toThrow("One or more skills do not exist.");

            expect(UserSkill.bulkCreate).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-018: should log and propagate database errors", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockResolvedValue([{}]);
            UserSkill.bulkCreate.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                createUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Beginner" }
                ])
            ).rejects.toThrow("Database error");

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error creating user skills:",
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });

    });


    // ==========================================
    // updateUserSkills()
    // ==========================================

    describe("updateUserSkills()", () => {

        const validSkills = [
            { skill_set_id: 1, proficiency_level: "Intermediate" },
            { skill_set_id: 2, proficiency_level: "Advanced" }
        ];

        test("AT-SK-019: should replace user skills and return the updated list", async () => {

            const updated = [{ id: 1 }, { id: 2 }];

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.destroy.mockResolvedValue(1);
            UserSkill.bulkCreate.mockResolvedValue([]);
            UserSkill.findAll.mockResolvedValue(updated);

            const result = await updateUserSkills(5, validSkills);

            expect(result).toEqual(updated);
            expect(UserSkill.findAll).toHaveBeenCalledWith({
                where: { user_id: 5 }
            });
        });


        test("AT-SK-020: should start a database transaction", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.findAll.mockResolvedValue([]);

            await updateUserSkills(5, validSkills);

            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
        });


        test("AT-SK-021: should delete existing skills inside the transaction", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.findAll.mockResolvedValue([]);

            await updateUserSkills(5, validSkills);

            expect(UserSkill.destroy).toHaveBeenCalledWith({
                where: { user_id: 5 },
                transaction: mockTransaction
            });
        });


        test("AT-SK-022: should create new skills inside the transaction", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.findAll.mockResolvedValue([]);

            await updateUserSkills(5, validSkills);

            expect(UserSkill.bulkCreate).toHaveBeenCalledWith(
                [
                    { user_id: 5, skill_set_id: 1, proficiency_level: "Intermediate" },
                    { user_id: 5, skill_set_id: 2, proficiency_level: "Advanced" }
                ],
                { transaction: mockTransaction }
            );
        });


        test("AT-SK-023: should commit the transaction on success", async () => {

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.findAll.mockResolvedValue([]);

            await updateUserSkills(5, validSkills);

            expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
            expect(mockTransaction.rollback).not.toHaveBeenCalled();
        });


        test("AT-SK-024: should delete before creating new skills", async () => {

            const callOrder = [];

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.findAll.mockResolvedValue([]);
            UserSkill.destroy.mockImplementation(async () => {
                callOrder.push("destroy");
            });
            UserSkill.bulkCreate.mockImplementation(async () => {
                callOrder.push("bulkCreate");
            });

            await updateUserSkills(5, validSkills);

            expect(callOrder).toEqual(["destroy", "bulkCreate"]);
        });


        test("AT-SK-025: should roll back and not delete when skills are invalid", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(updateUserSkills(5, [])).rejects.toThrow(
                "Please provide at least one skill."
            );

            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(mockTransaction.commit).not.toHaveBeenCalled();
            expect(UserSkill.destroy).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-026: should roll back and not delete when a skill does not exist", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockResolvedValue([{}]);

            await expect(
                updateUserSkills(5, validSkills)
            ).rejects.toThrow("One or more skills do not exist.");

            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(UserSkill.destroy).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-027: should reject duplicate skills and roll back", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(
                updateUserSkills(5, [
                    { skill_set_id: 1, proficiency_level: "Beginner" },
                    { skill_set_id: 1, proficiency_level: "Advanced" }
                ])
            ).rejects.toThrow("Duplicate skills are not allowed.");

            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-028: should roll back when creating new skills fails", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.destroy.mockResolvedValue(1);
            UserSkill.bulkCreate.mockRejectedValue(
                new Error("Insert failed")
            );

            await expect(
                updateUserSkills(5, validSkills)
            ).rejects.toThrow("Insert failed");

            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(mockTransaction.commit).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-029: should roll back when deleting existing skills fails", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockResolvedValue([{}, {}]);
            UserSkill.destroy.mockRejectedValue(
                new Error("Delete failed")
            );

            await expect(
                updateUserSkills(5, validSkills)
            ).rejects.toThrow("Delete failed");

            expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
            expect(UserSkill.bulkCreate).not.toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });


        test("AT-SK-030: should log errors when the update fails", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            SkillSet.findAll.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                updateUserSkills(5, validSkills)
            ).rejects.toThrow("Database error");

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error updating user skills:",
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });

    });

});