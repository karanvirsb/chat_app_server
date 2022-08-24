import UsersDb from ".";
import makeFakerComment from "../../../../__test__/fixures/user";

describe("Users DB", () => {
    it("Insert a user", async () => {
        const user = await makeFakerComment();
        const insertUser = await UsersDb.insert({ data: user });
        expect(insertUser?.username).toBe(user.username);
    });
    it.skip("Find user by Id 1", async () => {
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
