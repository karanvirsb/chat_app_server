import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";

describe.skip("creating channel use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };
    const channelDb = makeChannelDb({ makeDb });
    const createChannel = makeCreateChannel({
        handleModeration,
        channelDb,
    });

    afterEach(async () => {
        clearDb("group_channels");
    });

    test("SUCCESS: created channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        console.log(new Date().toUTCString());
        const createdChannel = await createChannel(channel);

        expect(createdChannel.data?.channelName).toBe(channel.channelName);
    });

    test("ERROR: channel name was not provided", async () => {
        const channel = await makeFakeChannel();
        channel.channelName = "";
        try {
            const createdChannel = await createChannel(channel);
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Channel name needs to be supplied");
        }
    });

    test("ERROR: group id was not provided", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "";
        try {
            const createdChannel = await createChannel(channel);
        } catch (err) {
            if (err instanceof Error)
                expect(err.message).toBe("Group Id needs to be supplied");
        }
    });
});
