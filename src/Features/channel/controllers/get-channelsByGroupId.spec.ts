import makeChannelDb from "../data-access/channel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateChannel from "../use-cases/createChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeGetChannelsByGroupIdController from "./get-channelsByGroupId";
import makeGetChannelsByGroupId from "../use-cases/getChannelsByGroupId";

describe("Get channels by group id controller", () => {
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

    const getChannelsByGroupId = makeGetChannelsByGroupId({ channelDb });
    const getChannelsByGroupIdController = makeGetChannelsByGroupIdController({
        getChannelsByGroupId,
    });

    afterEach(async () => {
        clearDb("channelt");
    });

    test("SUCCESS: get channel by group id", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { groupId: channel.groupId },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getChannelsByGroupIdController(
            channelRequest
        );
        if (foundChannels.body.data)
            expect(foundChannels.body.data[0].channelId).toBe(
                channel.channelId
            );
    });

    test("ERROR: group id does not exist", async () => {
        const channel = await makeFakeChannel();
        channel.groupId = "123";
        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { groupId: "" },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getChannelsByGroupIdController(
            channelRequest
        );
        expect(foundChannels.body.error).toBe("Group Id needs to be supplied");
    });
});
