import buildUser from ".";

describe("user", () => {
    const tempUser = {
        userId: "1234567909876543",
        username: "John123",
        email: "JohnB@gmail.com",
        password: "John_123",
        status: "offline",
        refreshToken: "131923902fjlkj",
    };
    it("User id has to be valid", () => {
        expect(() => buildUser({ ...tempUser, userId: "" })).toThrow(
            "User must have an Id greater than 10 characters"
        );
    });
    it("Have to have username greater than 3 letters", () => {
        expect(() => buildUser({ ...tempUser, username: "wq" })).toThrow(
            "Username must be greater than 3 characters but less than 30"
        );
    });

    it("Username contains html", () => {
        expect(() =>
            buildUser({
                ...tempUser,
                username: "<img src=x onerror=alert('img') />",
            })
        ).toThrow("Username does not contain any valid characters");
    });

    it("Have to have email", () => {
        expect(() => buildUser({ ...tempUser, email: "" })).toThrow(
            "Email must be valid"
        );
    });
    it("Must have a password", () => {
        expect(() => buildUser({ ...tempUser, password: "" })).toThrow(
            "Password must exist"
        );
    });
    it("Must have a status", () => {
        expect(() => buildUser({ ...tempUser, status: "" })).toThrow(
            "Must have a valid status"
        );
    });
    it("Must have a refreshToken", () => {
        expect(() => buildUser({ ...tempUser, refreshToken: "" })).toThrow(
            "Must have a valid refresh token"
        );
    });

    it("User is deleted name changes", () => {
        const user = buildUser({ ...tempUser });
        user.markDeleted();

        expect(user.getUsername()).toBe("Deleted :`(");
    });
});
