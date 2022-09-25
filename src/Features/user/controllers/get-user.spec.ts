import { getAnUser } from ".";
import makeFakeUser from "../../../../__test__/fixures/user";

describe("Get user controller", () => {
    it("successfully retrieve user", async () => {
        const user = await getAnUser({
            body: {},
            headers: {},
            ip: "string",
            method: "GET",
            params: { id: "5c0fc896-1af1-4c26-b917-550ac5eefa9e" },
            path: "",
            query: {},
        });
        console.log(user);
        expect(user.body.data.username).toBe("tester");
    });
});
