import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeRemoveUserFromGroup from "../use-cases/removeUserFromGroup";
import makeDeleteUserFromGroupController from "./delete-userFromGroup";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Remove user from group controller", () => {
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
    const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });
    const deleteUserFromGroupController = makeDeleteUserFromGroupController({
        removeUserFromGroup,
    });

    beforeEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: remove user from group", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: group.groupId,
                userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
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
        const deletedUser = await deleteUserFromGroupController(groupRequest);
        expect(deletedUser.body.data?.uId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
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
        const deletedUser = await deleteUserFromGroupController(groupRequest);
        expect(deletedUser.body.error).toBe("Group Id needs to be supplied");
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
        const deletedUser = await deleteUserFromGroupController(groupRequest);
        expect(deletedUser.body.error).toBe("User Id needs to be supplied");
    });
});
