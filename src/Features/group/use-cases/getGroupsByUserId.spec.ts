import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeGetGroupsByUserId from "./getGroupsByUserId";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Get groups by user id cases", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    let getGroupsByUserId = makeGetGroupsByUserId({ groupDb });

    afterEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: Get groups by user id", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroups = await getGroupsByUserId(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        if (foundGroups.data)
            expect(foundGroups.data[0].groupId).toBe(group.groupId);
    });

    test("ERROR: user id is missing", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const foundGroups = await getGroupsByUserId("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied.");
        }
    });
});
