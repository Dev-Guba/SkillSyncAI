import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock bcrypt
jest.unstable_mockModule("bcrypt", () => ({
    default: {
        hash: jest.fn()
    }
}));

// Mock models to prevent database initialization
jest.unstable_mockModule("../model/User.js", () => ({
    default: {
        create: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.unstable_mockModule("../model/Role.js", () => ({
    default: {}
}));

jest.unstable_mockModule("../model/relation.js", () => ({
    SkillSet: { name: "SkillSet" },
    UserProfile: { name: "UserProfile" },
    UserSkill: { name: "UserSkill" },
    JobTitle: { name: "JobTitle" },
    Program: { name: "Program" },
    ProgramSkills: { name: "ProgramSkills" }
}));

const bcrypt = (await import("bcrypt")).default;

const User = (await import("../model/User.js")).default;

const {
    SkillSet,
    UserProfile,
    JobTitle,
    Program
} = await import("../model/relation.js");

// NOTE: adjust this path to match your actual service file name
const {
    createUser,
    getSelfUser
} = await import("../services/userServices.js");


describe("userServices alpha tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ==========================================
    // createUser()
    // ==========================================

    describe("createUser()", () => {

        test("AT-US-001: should create a user with a hashed password", async () => {

            const createdAt = new Date("2026-01-01");
            const updatedAt = new Date("2026-01-02");

            const mockUser = {
                user_id: 1,
                username: "juan",
                password: "hashed_pw",
                role_id: 2
            };

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockResolvedValue(mockUser);

            const result = await createUser(
                "juan",
                "plain_pw",
                2,
                createdAt,
                updatedAt
            );

            expect(User.create).toHaveBeenCalledTimes(1);
            expect(User.create).toHaveBeenCalledWith({
                username: "juan",
                password: "hashed_pw",
                role_id: 2,
                created_at: createdAt,
                updated_at: updatedAt
            });
            expect(result).toEqual(mockUser);
        });


        test("AT-US-002: should hash the password using 10 salt rounds", async () => {

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockResolvedValue({});

            await createUser("juan", "plain_pw", 2);

            expect(bcrypt.hash).toHaveBeenCalledTimes(1);
            expect(bcrypt.hash).toHaveBeenCalledWith("plain_pw", 10);
        });


        test("AT-US-003: should never store the plain text password", async () => {

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockResolvedValue({});

            await createUser("juan", "plain_pw", 2);

            const payload = User.create.mock.calls[0][0];

            expect(payload.password).not.toBe("plain_pw");
            expect(payload.password).toBe("hashed_pw");
        });


        test("AT-US-004: should return the newly created user", async () => {

            const created = { user_id: 10, username: "maria" };

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockResolvedValue(created);

            const result = await createUser("maria", "secret", 1);

            expect(result.user_id).toBe(10);
            expect(result.username).toBe("maria");
        });


        test("AT-US-005: should pass undefined for omitted timestamps", async () => {

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockResolvedValue({});

            await createUser("juan", "plain_pw", 2);

            const payload = User.create.mock.calls[0][0];

            expect(payload.created_at).toBeUndefined();
            expect(payload.updated_at).toBeUndefined();
        });


        test("AT-US-006: should not create a user when password hashing fails", async () => {

            bcrypt.hash.mockRejectedValue(
                new Error("Hashing failed")
            );

            await expect(
                createUser("juan", "plain_pw", 2)
            ).rejects.toThrow("Hashing failed");

            expect(User.create).not.toHaveBeenCalled();
        });


        test("AT-US-007: should propagate database errors", async () => {

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                createUser("juan", "plain_pw", 2)
            ).rejects.toThrow("Database error");
        });


        test("AT-US-008: should propagate duplicate username errors", async () => {

            bcrypt.hash.mockResolvedValue("hashed_pw");
            User.create.mockRejectedValue(
                new Error("Validation error: username must be unique")
            );

            await expect(
                createUser("juan", "plain_pw", 2)
            ).rejects.toThrow("Validation error: username must be unique");
        });

    });


    // ==========================================
    // getSelfUser()
    // ==========================================

    describe("getSelfUser()", () => {

        test("AT-US-009: should return the user with related data", async () => {

            const mockUser = {
                user_id: 1,
                username: "juan",
                UserProfile: { first_name: "Juan" },
                SkillSets: [{ skill_set_name: "JavaScript" }],
                JobTitles: [{ job_title_name: "Developer" }]
            };

            User.findOne.mockResolvedValue(mockUser);

            const result = await getSelfUser(1);

            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });


        test("AT-US-010: should find the user by user ID", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(5);

            const query = User.findOne.mock.calls[0][0];

            expect(query.where).toEqual({ user_id: 5 });
        });


        test("AT-US-011: should exclude the password from the result", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(1);

            const query = User.findOne.mock.calls[0][0];

            expect(query.attributes).toEqual({
                exclude: ["password"]
            });
        });


        test("AT-US-012: should include the user profile with program and program skills", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(1);

            const query = User.findOne.mock.calls[0][0];
            const profileInclude = query.include[0];

            expect(profileInclude.model).toBe(UserProfile);
            expect(profileInclude.include[0].model).toBe(Program);
            expect(profileInclude.include[0].include[0].model).toBe(SkillSet);
        });


        test("AT-US-013: should include user skills with proficiency level", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(1);

            const query = User.findOne.mock.calls[0][0];
            const skillInclude = query.include[1];

            expect(skillInclude.model).toBe(SkillSet);
            expect(skillInclude.through).toEqual({
                attributes: ["proficiency_level"]
            });
        });


        test("AT-US-014: should include job titles with only id and name", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(1);

            const query = User.findOne.mock.calls[0][0];
            const jobInclude = query.include[2];

            expect(jobInclude.model).toBe(JobTitle);
            expect(jobInclude.attributes).toEqual([
                "job_title_id",
                "job_title_name"
            ]);
        });


        test("AT-US-015: should include exactly three associations", async () => {

            User.findOne.mockResolvedValue({});

            await getSelfUser(1);

            const query = User.findOne.mock.calls[0][0];

            expect(query.include).toHaveLength(3);
        });


        test("AT-US-016: should return null when the user does not exist", async () => {

            User.findOne.mockResolvedValue(null);

            const result = await getSelfUser(999);

            expect(result).toBeNull();
        });


        test("AT-US-017: should propagate database errors", async () => {

            User.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await expect(getSelfUser(1)).rejects.toThrow(
                "Database error"
            );
        });

    });

});