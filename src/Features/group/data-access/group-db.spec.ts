import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeGroupDb, { IMakeGroupDb } from "./group-db";
import makeFakerGroup from "../../../../__test__/fixures/group";

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

    test("inserted group correctly", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        console.log(res);
        expect(res.data?.groupId).toBe(group.groupId);
    });

    test("Find group by id", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const foundGroup = await GroupDb.findById(group.groupId);
        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test("updating group name", async () => {
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

    test("deleting group", async () => {
        const group = await makeFakerGroup();

        const res = await GroupDb.createGroup(
            group,
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const deletedGroup = await GroupDb.removeGroup(group.groupId);

        expect(deletedGroup.data?.groupName).toBe(group.groupName);
    });
});
