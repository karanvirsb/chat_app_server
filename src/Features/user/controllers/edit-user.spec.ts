import { editAnUser } from ".";

describe("Edit user controller", () => {
    it("edit user ", async () => {
        const edittedUser = await editAnUser({
            body: {
                id: "312c0878-04c3-4585-835e-c66900ccc7a1",
                updates: { status: "offline" },
            },
            headers: {},
            ip: "string",
            method: "GET",
            params: {},
            path: "",
            query: {},
        });

        expect(edittedUser.body.data.status).toBe("offline");
        console.log(edittedUser);
    });
});
