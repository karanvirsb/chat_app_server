import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makePrivateChannelDb from "./privateChannel-db";

describe.skip("Private Channel db method tests", () => {
    jest.setTimeout(10000);
    const privateChannelDB = makePrivateChannelDb({ makeDb });

    afterEach(async () => {
        await clearDb("private_channels");
    });

    test("SUCCESS: create a private channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);
        console.log(res);

        expect(res.data?.channelName).toBe(channel.channelName);
    });

    test("SUCCESS: Delete channel", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);

        const deletedChannel = await privateChannelDB.deletePrivateChannel(
            channel.channelId
        );
        expect(deletedChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get private channel by id", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const res = await privateChannelDB.createPrivateChannel(channel);

        const foundChannel = await privateChannelDB.getPrivateChannelById(
            channel.channelId
        );
        expect(foundChannel.data?.channelId).toBe(channel.channelId);
    });

    test("SUCCESS: get channels by group id", async () => {
        let channel = await makeFakeChannel();
        channel.groupId = "123";

        let res = await privateChannelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await privateChannelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await privateChannelDB.createChannel(channel);

        channel = await makeFakeChannel();
        channel.groupId = "123";
        res = await privateChannelDB.createChannel(channel);

        const foundChannels = await privateChannelDB.getChannelsByGroupId(
            channel.groupId
        );
        console.log(foundChannels);
        if (foundChannels.data)
            expect(foundChannels.data[0].channelName).toBe(channel.channelName);
    });
});
