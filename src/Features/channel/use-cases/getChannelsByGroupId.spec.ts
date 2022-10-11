import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeGetChannelsByGroupId from "./getChannelsByGroupId";

describe.skip("get channels by group id use case", () => {
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
    const getChannelsByGroupId = makeGetChannelsByGroupId({
        channelDb,
    });

    afterEach(async () => {
        clearDb("channelt");
    });

    test("SUCCESS: get channels by group id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        const foundChannel = await getChannelsByGroupId(channel.groupId);
        if (foundChannel.data)
            expect(foundChannel.data[0].channelName).toBe(channel.channelName);
    });

    test("ERROR: group id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const createdChannel = await createChannel(channel);

        try {
            const foundChannel = await getChannelsByGroupId("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Group Id needs to be supplied");
        }
    });
});
