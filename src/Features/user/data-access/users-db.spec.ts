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

    it.skip("Insert a user", async () => {
        // successful
        const user = await makeFakerComment();
        const resp = await UsersDb.insert({ data: user });

        if (resp.success) {
            console.log(resp);
            expect(resp?.data?.username).toBe(user.username);
        }
    });
    it.skip("Find user by Id", async () => {
        //successful
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findById({ id: fakeUser.userId });
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it.skip("Find user by username", async () => {
        // success
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findByUsername(fakeUser.username);
        if (resp.success) {
            expect(resp.data?.email).toBe(fakeUser.email);
        }
    });

    it.skip("Find user by email", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.findByEmail(fakeUser.email);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it.skip("Remove user by Id", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.remove(fakeUser.userId);
        if (resp.success) {
            expect(resp.data?.username).toBe(fakeUser.username);
        }
    });

    it("Update user", async () => {
        const fakeUser = await makeFakerComment();
        const insertedUser = await UsersDb.insert({ data: fakeUser });
        const resp = await UsersDb.update({
            userId: fakeUser.userId,
            updates: {
                username: "johnB",
                password: "",
                email: "",
                userId: "",
                refreshToken: "",
                status: "offline",
            },
        });
        if (resp.success) {
            expect(resp.data?.username).toBe("johnB");
            expect(resp.data?.status).toBe("offline");
        }
    });
});
