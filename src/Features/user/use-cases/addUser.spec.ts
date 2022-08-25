import { addUser } from ".";
import makeFakeUser from "../../../../__test__/fixures/user";

describe("Add User case", () => {
    it.skip("User added successfully", async () => {
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
});
