import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeGroupDb, { IMakeGroupDb } from "./group-db";
import makeFakerGroup from "../../../../__test__/fixures/group";
import inviteCodeGenerator from "../../../Utilities/inviteCodeGenerator";

describe("Group databse access", () => {
    let GroupDb: IMakeGroupDb["returnType"];

    beforeAll(async () => {
        GroupDb = makeGroupDb({ makeDb });

        await clearDb("groupt");
    });

    afterEach(async () => {
        await clearDb("groupt");
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
        await closeDb();
    });

    test.skip("inserted group correctly", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        expect(res.data?.groupId).toBe(group.groupId);
    });

    test.skip("Find group by id", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const foundGroup = await GroupDb.findById(group.groupId);
        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test.skip("updating group name", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const updatedGroup = await GroupDb.updateGroupName(
            group.groupId,
            "Coders"
        );

        expect(updatedGroup.data?.groupName).toBe("Coders");
    });

    test.skip("deleting group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const deletedGroup = await GroupDb.removeGroup(group.groupId);

        expect(deletedGroup.data?.groupName).toBe(group.groupName);
    });

    test.skip("updating group invite code", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const newCode = inviteCodeGenerator.makeInviteCode();
        const updatedGroup = await GroupDb.regenerateInviteCode(
            group.groupId,
            newCode
        );

        expect(updatedGroup.data?.inviteCode).toBe(newCode);
    });

    test.skip("Find group by invite code", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const foundGroup = await GroupDb.findByInviteCode(group.inviteCode);
        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test.skip("Find users of group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const users = await GroupDb.findUsersByGroupId(group.groupId);
        if (users.data)
            expect(users.data[0].userId).toBe(
                "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
            );
    });

    test("Adding user to group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const addedUser = await GroupDb.addUserToGroup(
            group.groupId,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
            ["2001"]
        );

        expect(addedUser.data?.uId).toBe(
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
    });
});
