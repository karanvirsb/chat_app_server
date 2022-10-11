import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";

describe("creating channel use case", () => {
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
        clearDb("channelt");
    });

    test("SUCCESS: created channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        console.log(new Date().toUTCString());
        const createdChannel = await createChannel(
            channel.channelName,
            channel.groupId
        );

        expect(createdChannel.data?.channelName).toBe(channel.channelName);
    });
});
