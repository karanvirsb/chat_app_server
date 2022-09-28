import makeAddUser from "./addUser";
import { moderateName } from "../../../Utilities/moderateText";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeUsersDb from "../data-access/users-db";
import makeFakeUser from "../../../../__test__/fixures/user";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Add User case", () => {
    let usersDb = makeUsersDb({ makeDb });
    let addUser = makeAddUser({ usersDb, handleModeration });

    afterAll(() => {
        clearDb("usert");
    });

    it("User added successfully", async () => {
        const user = await makeFakeUser();
        const resp = await addUser(user);
        if (resp.success) {
            expect(resp.data?.username).toBe(user.username);
        }
    });

    it("Duplicate User", async () => {
        const user = await makeFakeUser();
        const resp = await addUser(user);
        if (resp.success) {
            const err = await addUser(user);
            if (err.success) expect(err.error).toBe("User already exists");
        }
    });

    it("Moderated username", async () => {
        const user = await makeFakeUser();
        user["username"] = "bullshit";

        const resp = await addUser(user);
        if (!resp.success) {
            expect(resp.error).toBe("Username contains profanity");
        }
    });
});
