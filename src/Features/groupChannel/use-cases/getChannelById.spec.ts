import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeGetChannelById from "./getChannelById";

describe("get channel by id use case", () => {
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
    const getChannelById = makeGetChannelById({
        channelDb,
    });

    afterEach(async () => {
        clearDb("group_channels");
    });

    test("SUCCESS: get channel by id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        const foundChannel = await getChannelById(channel.channelId);
        expect(foundChannel.data?.channelName).toBe(channel.channelName);
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        try {
            const foundChannel = await getChannelById("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied");
        }
    });
});
