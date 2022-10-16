import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeGetMessagesByChannelId from "./getMessagesByChannelId";

describe.skip("Getting messages by channel id use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const getMessagesByChannelId = makeGetMessagesByChannelId({ messageDb });

    afterEach(async () => {
        clearDb("messaget");
    });

    test("SUCCESS: getting a message", async () => {
        jest.setTimeout(15000);
        const message = await makeFakeMessage(
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
        const message = await makeFakeMessage(
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
