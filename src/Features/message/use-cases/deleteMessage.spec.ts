import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeDeleteMessage from "./deleteMessage";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";

describe.skip("Create message use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const deleteMessage = makeDeleteMessage({ messageDb });

    afterEach(async () => {
        clearDb("messaget");
    });

    test("SUCCESS: deleting a message", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        const deletedMessage = await deleteMessage(message.messageId);

        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: message id is missing", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        try {
            const deletedMessage = await deleteMessage("");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
