import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateChannel, {
    handleModerationType,
} from "./createPrivateChannel";
import { moderateName } from "../../../Utilities/moderateText";
import makeGetPrivateChannelsByUserId from "./getPrivateChannelsByUserId";
import makeFakePrivateChannel from "../../../../__test__/fixures/privateChannel";
import userTests from "../../../../__test__/functions/user";

describe("get private channels by user id use case", () => {
    const handleModeration: handleModerationType = async (
        channelName: string
    ) => {
        return await moderateName(channelName);
    };
    const privateChannelDb = makePrivateChannelDb({ makeDb });
    const createPrivateChannel = makeCreatePrivateChannel({
        handleModeration,
        privateChannelDb,
    });
    const getPrivateChannelsByUserId = makeGetPrivateChannelsByUserId({
        privateChannelDb,
    });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const secondUser = await userTests.addTestUserToDB({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    afterAll(async () => {
        await clearDb("group_messages");
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: get private channels by group id", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const createdChannel = await createPrivateChannel(channel);

        const foundChannel = await getPrivateChannelsByUserId(channel.userId);
        if (foundChannel.data)
            expect(foundChannel.data[0].channelName).toBe(channel.channelName);
    });

    test("ERROR: user id does not exist", async () => {
        const channel = await makeFakePrivateChannel(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const createdChannel = await createPrivateChannel(channel);

        try {
            const foundChannel = await getPrivateChannelsByUserId("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied");
        }
    });
});
