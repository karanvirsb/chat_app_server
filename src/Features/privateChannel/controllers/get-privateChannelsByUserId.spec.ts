import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import makeGetPrivateChannelsByUserId from "../use-cases/getPrivateChannelsByUserId";
import makeGetPrivateChannelsByUserIdController from "./get-privateChannelsByUserId";

describe("Get private channels by group id controller", () => {
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

    const privateChannelDb = makePrivateChannelDb({ makeDb });
    const createChannel = makeCreatePrivateChannel({
        handleModeration,
        privateChannelDb,
    });

    const getPrivateChannelsByUserId = makeGetPrivateChannelsByUserId({
        privateChannelDb,
    });
    const getPrivateChannelsByUserIdController =
        makeGetPrivateChannelsByUserIdController({
            getPrivateChannelsByUserId,
        });

    afterEach(async () => {
        clearDb("private_channels");
    });

    test("SUCCESS: get channel by user id", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { userId: channel.userId },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getPrivateChannelsByUserIdController(
            channelRequest
        );
        if (foundChannels.body.data)
            expect(foundChannels.body.data[0].channelId).toBe(
                channel.channelId
            );
    });

    test("ERROR: user id does not exist", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { userId: "" },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannels = await getPrivateChannelsByUserIdController(
            channelRequest
        );
        expect(foundChannels.body.error).toBe("User Id needs to be supplied");
    });
});
