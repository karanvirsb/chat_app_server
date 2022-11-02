import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeDeleteChannelController from "./delete-channel";

describe.skip("Delete channel controller", () => {
    // const channelRequest = {
    //     body: {},
    //     headers: {},
    //     ip: "",
    //     method: "",
    //     params: {},
    //     path: "",
    //     query: {},
    // };
    const handleModeration = async (name: string) => {
        return await moderateName(name);
    };

    const channelDb = makeChannelDb({ makeDb });
    const createChannel = makeCreateChannel({ handleModeration, channelDb });

    const deleteChannel = makeDeleteChannel({ channelDb });
    const deleteChannelController = makeDeleteChannelController({
        deleteChannel,
    });

    afterEach(async () => {
        clearDb("group_channels");
    });

    test("SUCCESS: delete channel", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: { channelId: channel.channelId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const deletedChannel = await deleteChannelController(channelRequest);
        expect(deletedChannel.body.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";

        const channelRequest = {
            body: { channelId: "" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const deletedChannel = await deleteChannelController(channelRequest);
        expect(deletedChannel.body.error).toBe(
            "Channel Id needs to be supplied"
        );
    });
});
