import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDeleteChannel from "./deleteChannel";
import { moderateName } from "../../../Utilities/moderateText";
import groupTests from "../../../../__test__/functions/group";

describe("deleting channel use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };

    const channelDb = makeChannelDb({ makeDb });
    const deleteChannel = makeDeleteChannel({
        channelDb,
    });
    const createChannel = makeCreateChannel({
        handleModeration,
        channelDb,
    });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedGroup = await groupTests.createTestGroup({
            groupId: "123",
            userId: "123",
        });
    });

    afterAll(async () => {
        await clearDb("group_channels");
        const deletedGroup = await groupTests.deleteTestGroup({
            groupId: "123",
            userId: "123",
        });
    });

    test("SUCCESS: deleting channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const addedChannel = await createChannel(channel);

        const deletedChannel = await deleteChannel(channel.channelId);
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id not provided", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const addedChannel = await createChannel(channel);

        try {
            const deletedChannel = await deleteChannel("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied");
        }
    });
});
