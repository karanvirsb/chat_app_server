import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import makeGetPrivateChannelByIdController from "./get-privateChannelById";
import makeGetPrivateChannelById from "../use-cases/getPrivateChannelById";

describe("Get private channel by id controller", () => {
    jest.setTimeout(10000);
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

    const getPrivateChannelById = makeGetPrivateChannelById({
        privateChannelDb,
    });
    const getPrivateChannelByIdController = makeGetPrivateChannelByIdController(
        {
            getPrivateChannelById,
        }
    );

    afterEach(async () => {
        clearDb("private_channels");
    });

    test("SUCCESS: get channel by id", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { channelId: channel.channelId },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannel = await getPrivateChannelByIdController(
            channelRequest
        );
        expect(foundChannel.body.data?.channelId).toBe(channel.channelId);
    });

    test("ERROR: channel id does not exist", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const channelRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { channelId: "" },
            path: "",
            query: {},
        };

        const createdChannel = await createChannel(channel);

        const foundChannel = await getPrivateChannelByIdController(
            channelRequest
        );
        expect(foundChannel.body.error).toBe("Channel Id needs to be supplied");
    });
});
