import UsersDb from ".";
import makeFakerComment from "../../../../__test__/fixures/user";

describe("Users DB", () => {
    beforeEach(() => {
        UsersDb;
    });
    it("Insert a user", async () => {
        const user = await makeFakerComment();
        const insertUser = await UsersDb.insert({ data: user });
        expect(insertUser?.username).toBe(user.username);
    });
    it("Find user by Id", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const user = await UsersDb.findById({ id: fakeUser.userId });
        expect(user).toEqual(fakeUser);
    });
});
