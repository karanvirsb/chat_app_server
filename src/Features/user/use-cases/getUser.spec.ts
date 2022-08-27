import makeGetUser from "./getUser";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";

describe.skip("Delete use case", () => {
    jest.setTimeout(50000);
    let usersDb = makeUsersDb({ makeDb });
    let getUser = makeGetUser({ usersDb });

    afterAll(() => {
        clearDb();
    });

    it("Email was not supplied", async () => {
        expect(getUser("")).rejects.toThrow("Email must be passed through");
    });

    it("Get user who exists", async () => {
        const user = await makeFakeUser();
        await usersDb.insert({ data: user });

        const foundUser = await getUser(user.email);
        if (foundUser.success) {
            expect(foundUser.data?.userId).toBe(user.userId);
        }
    });

    it("Get user who does not exist", async () => {
        const foundUser = await getUser("1");
        if (foundUser.success && foundUser.data === undefined) {
            expect(foundUser.error).toBe("Could not find user with that email");
        }
    });
});
