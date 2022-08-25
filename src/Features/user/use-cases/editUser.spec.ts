import makeEditUser from "./editUser";
import { moderateName } from "../../../Utilities/moderateText";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Edit Users use case", () => {
    let usersDb = makeUsersDb({ makeDb });
    let editUser = makeEditUser({ usersDb, handleModeration });

    afterAll(() => {
        clearDb();
    });

    it("Edit user successfully", async () => {
        const user = await makeFakeUser();
        await usersDb.insert({ data: user });

        const updatedUser = await editUser({
            userId: user.userId,
            updates: {
                username: "JohnB",
            },
        });

        if (updatedUser.success) {
            expect(updatedUser.data?.username).toBe("JohnB");
        }
    });
    it("User does not exist", async () => {
        const updatedUser = await editUser({
            userId: "1",
            updates: { username: "hi" },
        });

        if (updatedUser.success && updatedUser.data === undefined) {
            expect(updatedUser.error).toBe(
                "Could not find any user with that id"
            );
        }
    });
});
