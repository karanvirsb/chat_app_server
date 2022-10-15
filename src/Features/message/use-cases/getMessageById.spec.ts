import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeGetMessageById from "./getMessageById";

describe("Create message use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const getMessageById = makeGetMessageById({ messageDb });

    afterEach(async () => {
        clearDb("messaget");
    });

    test("SUCCESS: getting a message", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        const foundMessage = await getMessageById(message.messageId);

        expect(foundMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: missing message id ", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        try {
            const foundMessage = await getMessageById("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});