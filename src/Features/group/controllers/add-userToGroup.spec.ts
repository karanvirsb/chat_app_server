import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddUserToGroup from "../use-cases/addUserToGroup";
import makeAddUserToGroupController from "./add-userToGroup";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("add user to group controller", () => {
    // const groupRequest = {
    //     body: {},
    //     headers: {},
    //     ip: "",
    //     method: "",
    //     params: {},
    //     path: "",
    //     query: {},
    // };

    const groupDb = makeGroupDb({ makeDb });
    const addGroup = makeAddGroup({ groupDb, handleModeration });
    const addUserToGroup = makeAddUserToGroup({ groupDb });
    const addUserToGroupController = makeAddUserToGroupController({
        addUserToGroup,
    });

    beforeEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: added user to the group", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: group.groupId,
                userId: "3443c648-3323-4d6b-8830-c8a1b66a043a",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const addedUser = await addUserToGroupController(groupRequest);
        expect(addedUser.body.data?.uId).toBe(
            "3443c648-3323-4d6b-8830-c8a1b66a043a"
        );
    });

    test("ERROR: missing group id to the group", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: "",
                userId: "3443c648-3323-4d6b-8830-c8a1b66a043a",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const addedUser = await addUserToGroupController(groupRequest);
        expect(addedUser.body.error).toBe("Group Id needs to be supplied");
    });

    test("ERROR: missing user id ", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: group.groupId,
                userId: "",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const addedUser = await addUserToGroupController(groupRequest);
        expect(addedUser.body.error).toBe("User Id needs to be supplied");
    });
});
