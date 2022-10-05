import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";
import { IInviteCodeGenerator } from "../../../Utilities/inviteCodeGenerator";
import makeAddGroup from "./addGroup";
import makeUpdateInviteCode from "./updateInviteCode";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe.skip("Updating invite code of group use case", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    const updateInviteCode = makeUpdateInviteCode({
        groupDb,
        inviteCodeGenerator,
    });

    beforeAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: update invite code", async () => {
        const group = await makeFakeGroup();
        const res = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const updatedGroup = await updateInviteCode(group.groupId);

        expect(updatedGroup.data?.inviteCode).not.toEqual(group.inviteCode);
    });

    test("ERROR: update invite code group id not given", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await updateInviteCode("");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });
});
