import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeDeleteMessageController from "./delete-message";

describe.skip("deleting a message controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const deleteMessage = makeDeleteMessage({ messageDb });
    const deleteMessageController = makeDeleteMessageController({
        deleteMessage,
    });

    afterEach(async () => {
        await clearDb("messaget");
    });

    test("SUCCESS: deleting a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: message.messageId,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const deletedMessage = await deleteMessageController(messageRequest);
        expect(deletedMessage.body.data?.text).toBe(message.text);
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: "",
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const deletedMessage = await deleteMessageController(messageRequest);

        expect(deletedMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });
});
