import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeUpdateGroupName from "./updateGroupName";
import sanitizeHtml from "sanitize-html";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}

describe("Updating group name use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const updateGroupName = makeUpdateGroupName({
        groupDb,
        handleModeration,
        sanitizeName: sanitizeText,
    });

    beforeAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("Update group name success", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        if (res.success) {
            const updatedGroup = await updateGroupName(group.groupId, "Coders");
            expect(updatedGroup.data?.groupName).toBe("Coders");
        }
    });

    test("ERROR: Update group name no group id", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName("", "Coders");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group id needs to be supplied");
        }
    });

    test("ERROR: Update group name no new group name", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(group.groupId, "");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("A new group name must be supplied");
        }
    });

    test("ERROR: Update group name contains profanity", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "bullshit"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group name contains profanity");
        }
    });

    test("ERROR: Update group name contains html", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "<html>n</html>"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Group name must contain valid characters"
                );
        }
    });

    test("ERROR: Update group name must be between 3 - 50 characters", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        try {
            const updatedGroup = await updateGroupName(
                group.groupId,
                "123456789012345678901234567890123456789012345678901234567890"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Group name must be between 3 and 50 characters long"
                );
        }
    });
});
