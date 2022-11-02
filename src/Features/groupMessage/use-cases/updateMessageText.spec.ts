import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeUpdateMessageText from "./updateMessageText";

describe.skip("updating message text use case", () => {
    jest.setTimeout(15000);
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const updateMessageText = makeUpdateMessageText({ messageDb });

    afterEach(async () => {
        clearDb("group_messages");
    });

    test("SUCCESS: updating a message text", async () => {
        const message = await makeFakeMessage(
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
        const message = await makeFakeMessage(
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
        const message = await makeFakeMessage(
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
