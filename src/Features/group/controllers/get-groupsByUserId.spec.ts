import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeGetGroupsByUserId from "../use-cases/getGroupsByUserId";
import makeGetGroupsByUserIdController from "./get-groupsByUserId";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("get groups by user Id controller", () => {
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
    const getGroupsByUserId = makeGetGroupsByUserId({ groupDb });
    const getGroupsByUserIdController = makeGetGroupsByUserIdController({
        getGroupsByUserId,
    });

    afterEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: get groups by user id", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc" },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const foundGroups = await getGroupsByUserIdController(groupRequest);
        if (foundGroups.body.data)
            expect(foundGroups.body.data[0].groupId).toBe(group.groupId);
    });

    test("ERROR: missing user id", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { userId: "" },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        const foundGroups = await getGroupsByUserIdController(groupRequest);
        expect(foundGroups.body.error).toBe("User Id needs to be supplied.");
    });
});
