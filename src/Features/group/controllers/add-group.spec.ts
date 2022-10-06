import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroupController from "./add-group";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Add group controller", () => {
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
    const addGroupController = makeAddGroupController({ addGroup });

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
                groupInfo: group,
                userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroupController(groupRequest);
        expect(addedGroup.body.data?.groupId).toBe(group.groupId);
    });

    test("ERROR: user Id was not given", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {
                groupInfo: group,
                userId: "",
            },
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedGroup = await addGroupController(groupRequest);

        expect(addedGroup.statusCode).toBe(400);
        expect(addedGroup.body.error).toBe("User id needs to be supplied");
    });
});
