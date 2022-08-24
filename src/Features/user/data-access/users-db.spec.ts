import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeUsersDb, { IMakeUsersDb } from "./users-db";
import makeFakerComment from "../../../../__test__/fixures/user";

describe("Users DB", () => {
    let UsersDb: IMakeUsersDb["returnType"];

    beforeAll(async () => {
        UsersDb = makeUsersDb({ makeDb });
        await clearDb();
    });

    afterAll(async () => {
        await clearDb();
        await closeDb();
    });

    it("Insert a user", async () => {
        // successful
        const user = await makeFakerComment();
        const resp = await UsersDb.insert({ data: user });

        if (resp.success) {
            console.log(resp);
            expect(resp?.data?.username).toBe(user.username);
        }
    });
    it("Find user by Id", async () => {
        //successful
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findById({ id: fakeUser.userId });
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Find user by username", async () => {
        // success
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findByUsername(fakeUser.username);
        if (resp.success) {
            expect(resp.data?.email).toBe(fakeUser.email);
        }
    });

    it("Find user by email", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findByEmail(fakeUser.email);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Remove user by Id", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.remove(fakeUser.userId);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });
});
