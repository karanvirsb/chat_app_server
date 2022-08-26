import makeDeleteUser from "./deleteUser";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";

describe.skip("Delete use case", () => {
    let usersDb = makeUsersDb({ makeDb });
    let deleteUser = makeDeleteUser({ usersDb });

    afterAll(() => {
        clearDb();
    });

    it("Error: Userid was not passed", async () => {
        expect(deleteUser("")).rejects.toThrow("An userId must be passed");
    });

    it("Deleted user successfully", async () => {
        const user = await makeFakeUser();
        const insertedUser = await usersDb.insert({ data: user });
        const deletedUser = await deleteUser(user.userId);

        if (deletedUser.success) {
            expect(deletedUser.data?.userId).toBe(user.userId);
        }
    });

    it.skip("User does not exist", async () => {
        const deletedUser = await deleteUser("1");

        if (deletedUser.success && deletedUser.data === undefined) {
            expect(deletedUser.error).toBe(
                "Could not find any user with that id"
            );
        }
    });
});
