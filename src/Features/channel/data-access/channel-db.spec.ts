import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeChannelDb from "./channel-db";

describe("Channel db method tests", () => {
    jest.setTimeout(10000);
    const channelDB = makeChannelDb({ makeDb });

    afterEach(async () => {
        await clearDb("channelt");
    });

    test("SUCCESS: create a channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);
        console.log(res);

        expect(res.data?.channelName).toBe(channel.channelName);
    });

    test("SUCCESS: Delete channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const deletedChannel = await channelDB.deleteChannel(channel.channelId);
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: update channel name", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const updatedChannel = await channelDB.updateChannelName(
            channel.channelId,
            "coders"
        );
        expect(updatedChannel.data?.channelName).toBe("coders");
    });

    test("SUCCESS: get channel by id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const foundChannel = await channelDB.getChannelById(channel.channelId);
        expect(foundChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get channels by group id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const res = await channelDB.createChannel(channel);

        const foundChannels = await channelDB.getChannelsByGroupId(
            channel.groupId
        );
        if (foundChannels.data)
            expect(foundChannels.data[0].channelName).toBe(channel.channelName);
    });
});
