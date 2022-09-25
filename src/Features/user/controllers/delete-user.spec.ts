import { deleteAnUser } from ".";

describe.skip("delete user controller", () => {
    it("deleting user", async () => {
        const deletedUser = await deleteAnUser({
            body: {
                id: "ce3735e4-b3de-48d4-853e-758c06b1a935",
            },
            headers: {},
            ip: "string",
            method: "GET",
            params: {},
            path: "",
            query: {},
        });

        expect(deletedUser.body.data.userId).toBe(
            "ce3735e4-b3de-48d4-853e-758c06b1a935"
        );
        console.log(deletedUser);
    });
});
