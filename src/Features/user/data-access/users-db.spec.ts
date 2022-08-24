import UsersDb from ".";

describe("Users DB", () => {
    it("Find user by Id 1", async () => {
        const user = await UsersDb.findById({ id: "1" });
        expect(user).toMatchObject({
            userid: "1",
            username: "johnb",
            email: "gsfs",
            password: "123ads",
            status: "online",
            refreshtoken: "123dasd",
        });
    });
});
