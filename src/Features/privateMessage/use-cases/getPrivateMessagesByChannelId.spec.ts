import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makeGetPrivateMessagesByChannelId from "./getPrivateMessagesByChannelId";

describe("Getting private messages by channel id use case", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });
    const getMessagesByChannelId = makeGetPrivateMessagesByChannelId({
        privateMessageDb,
    });

    beforeAll(async () => {
        const privateChannelDb = makePrivateChannelDb({ makeDb });
        const found = await privateChannelDb.getPrivateChannelById("123");
        if (!found.data) {
            await privateChannelDb.createPrivateChannel({
                channelId: "123",
                channelName: "coders",
                dateCreated: new Date(),
                friendsId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
                userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
            });
        }
    });

    afterEach(async () => {
        clearDb("private_messages");
    });

    test("SUCCESS: getting a message", async () => {
        jest.setTimeout(15000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        const foundMessage = await getMessagesByChannelId(
            message.messageId,
            message.dateCreated,
            10
        );

        if (foundMessage.data)
            expect(foundMessage.data[0].messageId).toBe(message.messageId);
    });

    test("ERROR: missing message id ", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const foundMessage = await getMessagesByChannelId(
                "",
                message.dateCreated
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
