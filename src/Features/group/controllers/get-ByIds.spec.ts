import makeGroupDb from "../data-access/group-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddGroup from "../use-cases/addGroup";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeGroup from "../../../../__test__/fixures/group";
import groupService from "../use-cases";
import makeGetGroupByIdController from "./get-byGroupId";
import makeGetGroupByInviteCodeController from "./get-byGroupInviteCode";
import makeGetUsersByGroupIdController from "./get-UsersByGroupId";

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

describe("Get group and users by id controller", () => {
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
    const getGroupByIdController = makeGetGroupByIdController({
        getGroupById: groupService.getGroupById,
    });
    const getGroupByInviteCodeController = makeGetGroupByInviteCodeController({
        getGroupByInviteCode: groupService.getGroupByInviteCode,
    });
    const getUsersByGroupIdController = makeGetUsersByGroupIdController({
        getUsersByGroupId: groupService.getUsersByGroupId,
    });

    beforeEach(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    afterAll(async () => {
        await clearDb("groupt");
        await clearDb('"groupUsers"');
    });

    test("SUCCESS: Get group by id", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { groupId: group.groupId },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByIdController(groupRequest);
        expect(foundGroup.body.data?.groupId).toBe(group.groupId);
    });

    test("ERROR: group id is missing for getGroupByIdController", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { groupId: "" },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByIdController(groupRequest);
        expect(foundGroup.statusCode).toBe(400);
        expect(foundGroup.body.error).toBe("Group Id needs to be supplied");
    });

    test("SUCCESS: get group by inviteCode ", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { inviteCode: group.inviteCode },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByInviteCodeController(groupRequest);
        expect(foundGroup.body.data?.groupId).toBe(group.groupId);
    });

    test("ERROR: invite code is missing for getGroupByInviteCodeController", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { inviteCode: "" },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByInviteCodeController(groupRequest);
        expect(foundGroup.statusCode).toBe(400);
        expect(foundGroup.body.error).toBe("Invite code needs to be supplied");
    });

    test("SUCCESS: get group users by groupId ", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { groupId: group.groupId },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundUsers = await getUsersByGroupIdController(groupRequest);
        if (foundUsers.body.data)
            expect(foundUsers?.body?.data[0].userId).toBe(
                "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
            );
    });

    test("ERROR: group id is missing for getUsersByGroupIdController", async () => {
        const group = await makeFakeGroup();
        const groupRequest = {
            body: {},
            headers: { "Content-Type": "application/json" },
            ip: "",
            method: "POST",
            params: { groupId: "" },
            path: "",
            query: {},
        };

        const addedGroup = await addGroup(
            group,
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );

        const foundGroup = await getGroupByIdController(groupRequest);
        expect(foundGroup.statusCode).toBe(400);
        expect(foundGroup.body.error).toBe("Group Id needs to be supplied");
    });
});
