import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeDeleteGroupController from "./delete-group";
import makeDeleteGroup from "../use-cases/deleteGroup";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Delete group controller", () => {
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
    const deleteGroup = makeDeleteGroup({ groupDb });
    const deleteGroupController = makeDeleteGroupController({ deleteGroup });

    beforeEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: add group to the database", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: group.groupId,
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
        const deletedGroup = await deleteGroupController(groupRequest);
        expect(deletedGroup.body.data?.groupId).toBe(group.groupId);
    });

    test("ERROR: group Id was not given", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupId: "",
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
        const deletedGroup = await deleteGroupController(groupRequest);

        expect(deletedGroup.statusCode).toBe(400);
        expect(deletedGroup.body.error).toBe("Group Id needs to be supplied");
    });
});
