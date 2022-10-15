import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeUpdateDateModified from "./updateDateModified";

describe("Create message use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const updateDateModified = makeUpdateDateModified({ messageDb });

    afterEach(async () => {
        clearDb("messaget");
    });

    test("SUCCESS: getting a message", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        const updatedMessage = await updateDateModified(
            message.messageId,
            new Date()
        );

        expect(updatedMessage.data?.dateModified).not.toEqual(
            message.dateModified
        );
    });

    test("ERROR: missing message id ", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        try {
            const updateMessage = await updateDateModified("", new Date());
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });
});
