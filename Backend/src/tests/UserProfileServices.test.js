import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from "@jest/globals";

// Mock models to prevent database initialization
jest.unstable_mockModule("../model/relation.js", () => ({
    UserProfile: {
        create: jest.fn(),
        findOne: jest.fn()
    }
}));

const { UserProfile } = await import("../model/relation.js");

// NOTE: adjust this path to match your actual service file name
const {
    createUserProfile,
    updateUserProfile
} = await import("../services/userProfileServices.js");


describe("userProfileServices alpha tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ==========================================
    // createUserProfile()
    // ==========================================

    describe("createUserProfile()", () => {

        test("AT-UP-001: should create a user profile with all fields", async () => {

            const mockProfile = createMockProfileData();

            UserProfile.create.mockResolvedValue(mockProfile);

            const result = await createUserProfile(
                mockProfile.user_id,
                mockProfile.first_name,
                mockProfile.last_name,
                mockProfile.school,
                mockProfile.email,
                mockProfile.phone_number,
                mockProfile.birth_date,
                mockProfile.gender,
                mockProfile.bio,
                mockProfile.location,
                mockProfile.program_id
            );

            expect(UserProfile.create).toHaveBeenCalledTimes(1);
            expect(UserProfile.create).toHaveBeenCalledWith(mockProfile);
            expect(result).toEqual(mockProfile);
        });


        test("AT-UP-002: should map each argument to the correct profile field", async () => {

            UserProfile.create.mockResolvedValue({});

            await createUserProfile(
                7,
                "Maria",
                "Santos",
                "UP Visayas",
                "maria@example.com",
                "09171234567",
                "2002-05-10",
                "Female",
                "Aspiring developer",
                "Iloilo City",
                3
            );

            const payload = UserProfile.create.mock.calls[0][0];

            expect(payload.user_id).toBe(7);
            expect(payload.first_name).toBe("Maria");
            expect(payload.last_name).toBe("Santos");
            expect(payload.school).toBe("UP Visayas");
            expect(payload.email).toBe("maria@example.com");
            expect(payload.phone_number).toBe("09171234567");
            expect(payload.birth_date).toBe("2002-05-10");
            expect(payload.gender).toBe("Female");
            expect(payload.bio).toBe("Aspiring developer");
            expect(payload.location).toBe("Iloilo City");
            expect(payload.program_id).toBe(3);
        });


        test("AT-UP-003: should pass undefined for omitted optional fields", async () => {

            UserProfile.create.mockResolvedValue({});

            await createUserProfile(1, "Juan", "Dela Cruz");

            const payload = UserProfile.create.mock.calls[0][0];

            expect(payload.user_id).toBe(1);
            expect(payload.first_name).toBe("Juan");
            expect(payload.last_name).toBe("Dela Cruz");
            expect(payload.school).toBeUndefined();
            expect(payload.email).toBeUndefined();
            expect(payload.program_id).toBeUndefined();
        });


        test("AT-UP-004: should return the newly created profile", async () => {

            const created = { id: 99, ...createMockProfileData() };

            UserProfile.create.mockResolvedValue(created);

            const result = await createUserProfile(
                created.user_id,
                created.first_name,
                created.last_name,
                created.school,
                created.email,
                created.phone_number,
                created.birth_date,
                created.gender,
                created.bio,
                created.location,
                created.program_id
            );

            expect(result.id).toBe(99);
        });


        test("AT-UP-005: should propagate database errors and log them", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            UserProfile.create.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                createUserProfile(1, "Juan", "Dela Cruz")
            ).rejects.toThrow("Database error");

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error creating user profile:",
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });


        test("AT-UP-006: should propagate validation errors", async () => {

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            UserProfile.create.mockRejectedValue(
                new Error("Validation error: email must be unique")
            );

            await expect(
                createUserProfile(1, "Juan", "Dela Cruz", null, "dup@example.com")
            ).rejects.toThrow("Validation error: email must be unique");

            consoleErrorSpy.mockRestore();
        });

    });


    // ==========================================
    // updateUserProfile()
    // ==========================================

    describe("updateUserProfile()", () => {

        test("AT-UP-007: should find the profile using the user ID", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(mockProfile);

            await updateUserProfile(5, { first_name: "Maria" });

            expect(UserProfile.findOne).toHaveBeenCalledWith({
                where: { user_id: 5 }
            });
        });


        test("AT-UP-008: should update the profile with provided fields", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(mockProfile);

            const updates = {
                first_name: "Maria",
                last_name: "Santos",
                school: "UP Visayas",
                email: "maria@example.com",
                phone_number: "09171234567",
                birth_date: "2002-05-10",
                gender: "Female",
                bio: "Updated bio",
                location: "Iloilo City"
            };

            const result = await updateUserProfile(5, updates);

            expect(mockProfile.update).toHaveBeenCalledTimes(1);
            expect(mockProfile.update).toHaveBeenCalledWith(updates);
            expect(result).toEqual({ updated: true });
        });


        test("AT-UP-009: should throw an error when the profile does not exist", async () => {

            UserProfile.findOne.mockResolvedValue(null);

            await expect(
                updateUserProfile(999, { first_name: "Ghost" })
            ).rejects.toThrow("User profile not found.");
        });


        test("AT-UP-010: should not call update when the profile does not exist", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(null);

            await expect(
                updateUserProfile(999, { first_name: "Ghost" })
            ).rejects.toThrow();

            expect(mockProfile.update).not.toHaveBeenCalled();
        });


        test("AT-UP-011: should ignore fields that are not allowed to be updated", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(mockProfile);

            await updateUserProfile(5, {
                first_name: "Maria",
                user_id: 123,
                program_id: 8,
                role: "admin"
            });

            const payload = mockProfile.update.mock.calls[0][0];

            expect(payload).not.toHaveProperty("user_id");
            expect(payload).not.toHaveProperty("program_id");
            expect(payload).not.toHaveProperty("role");
            expect(payload.first_name).toBe("Maria");
        });


        test("AT-UP-012: should set omitted fields to undefined in the update payload", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(mockProfile);

            await updateUserProfile(5, { bio: "Only bio changed" });

            const payload = mockProfile.update.mock.calls[0][0];

            expect(payload.bio).toBe("Only bio changed");
            expect(payload.first_name).toBeUndefined();
            expect(payload.email).toBeUndefined();
            expect(payload.location).toBeUndefined();
        });


        test("AT-UP-013: should handle an empty updates object", async () => {

            const mockProfile = createMockProfileInstance();

            UserProfile.findOne.mockResolvedValue(mockProfile);

            await updateUserProfile(5, {});

            expect(mockProfile.update).toHaveBeenCalledTimes(1);

            const payload = mockProfile.update.mock.calls[0][0];

            Object.values(payload).forEach((value) => {
                expect(value).toBeUndefined();
            });
        });


        test("AT-UP-014: should propagate database errors from findOne", async () => {

            UserProfile.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                updateUserProfile(5, { first_name: "Maria" })
            ).rejects.toThrow("Database error");
        });


        test("AT-UP-015: should propagate errors from profile update", async () => {

            const mockProfile = createMockProfileInstance();

            mockProfile.update.mockRejectedValue(
                new Error("Update failed")
            );

            UserProfile.findOne.mockResolvedValue(mockProfile);

            await expect(
                updateUserProfile(5, { first_name: "Maria" })
            ).rejects.toThrow("Update failed");
        });

    });

});


// ==========================================
// MOCK DATA HELPERS
// ==========================================

function createMockProfileData() {

    return {
        user_id: 1,
        first_name: "Juan",
        last_name: "Dela Cruz",
        school: "West Visayas State University",
        email: "juan@example.com",
        phone_number: "09123456789",
        birth_date: "2001-01-15",
        gender: "Male",
        bio: "Computer science student",
        location: "Iloilo City",
        program_id: 2
    };
}

function createMockProfileInstance() {

    return {
        update: jest.fn().mockResolvedValue({ updated: true })
    };
}