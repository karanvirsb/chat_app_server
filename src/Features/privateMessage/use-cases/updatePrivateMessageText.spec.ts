import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makeUpdatePrivateMessageText from "./updatePrivateMessageText";

describe("updating private message text use case", () => {
    jest.setTimeout(15000);
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });
    const updateMessageText = makeUpdatePrivateMessageText({
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

    test("SUCCESS: updating a message text", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        const updatedMessage = await updateMessageText(
            message.messageId,
            "Coder's are awesome"
        );

        expect(updatedMessage.data?.text).toBe("Coder's are awesome");
    });

    test("ERROR: missing message id ", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const updateMessage = await updateMessageText("", "Coding");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });

    test("ERROR: missing text ", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const updateMessage = await updateMessageText(
                message.messageId,
                ""
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Update Value needs to be supplied."
                );
        }
    });
});
