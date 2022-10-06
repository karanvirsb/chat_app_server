import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeRemoveUserFromGroup from "./removeUserFromGroup";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Removing user from a group use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const removeUserFromGroup = makeRemoveUserFromGroup({ groupDb });

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
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const removedUser = await removeUserFromGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        expect(removedUser.data?.uId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
    });

    test("ERROR: removing user from a group but no group id", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await removeUserFromGroup(
                "",
                "3443c648-3323-4d6b-8830-c8a1b66a043a"
            );
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });

    test("ERROR: removing user from a group but no user id is provided", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await removeUserFromGroup(group.groupId, "");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("User Id needs to be supplied");
        }
    });
});
