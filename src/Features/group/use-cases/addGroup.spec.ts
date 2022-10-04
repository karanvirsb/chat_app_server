import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Adding group use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });

    beforeAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("Successfully insert group use case", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        console.log(res, group);
        if (res.success) {
            expect(res.data?.groupName).toBe(group.groupName);
        }
    });

    test("Duplicate group insert", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        if (res.success) {
            const err = await addGroup(
                group,
                "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
            );
            expect(err.error).toBe("Group already exists");
        }
    });

    test("Group name contains profanity", async () => {
        const group = await makeFakeGroup();
        group["groupName"] = "bullshit";
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        if (!res.success) {
            expect(res.error).toBe("Group name contains profanity");
        }
    });
});
