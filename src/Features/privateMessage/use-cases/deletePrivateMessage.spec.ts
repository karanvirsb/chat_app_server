import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makeDeletePrivateMessage from "./deletePrivateMessage";

describe("Deleting a private message use case", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
    const deletePrivateMessage = makeDeletePrivateMessage({ privateMessageDb });

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

    test("SUCCESS: deleting a message", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createPrivateMessage(message);

        const deletedMessage = await deletePrivateMessage(message.messageId);

        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: message id is missing", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createPrivateMessage(message);

        try {
            const deletedMessage = await deletePrivateMessage("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
