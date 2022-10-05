import { moderateName } from "../../../Utilities/moderateText";
import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";
import makeGetUsersByGroupId from "./getUsersByGroupId";
import { IGroup } from "../group";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Get use cases", () => {
    let groupDb = makeGroupDb({ makeDb });
    let addGroup = makeAddGroup({ groupDb, handleModeration });
    let getGroupById = makeGetGroupById({ groupDb });
    let getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
    let getUsersByGroupId = makeGetUsersByGroupId({ groupDb });

    beforeAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("Get group by id", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupById(group.groupId);

        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test("Get group by id error", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const groupErr = await getGroupById("");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });

    test("Get group by invite code", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByInviteCode(group.inviteCode);

        expect(foundGroup.data?.groupName).toBe(group.groupName);
    });

    test("Get group by invite code error", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            const err = await getGroupByInviteCode("");
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Invite code needs to be supplied");
        }
    });

    test("Get group by invite code", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundUsers = await getUsersByGroupId(group.inviteCode);

        if (foundUsers.data)
            expect(foundUsers.data[0].userId).toBe(
                "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
            );
    });

    test("Get group users by id error", async () => {
        let group = await makeFakeGroup();
        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        try {
            await getUsersByGroupId("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group Id needs to be supplied");
        }
    });
});
