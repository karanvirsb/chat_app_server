import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeUpdateDateModified from "../use-cases/updateDateModified";
import makeUpdateMessageText from "../use-cases/updateMessageText";
import makeUpdateDateModifiedController from "./update-dateModified";
import makeUpdateMessageTextController from "./update-messageText";

describe.skip("updating message text controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const updateMessageText = makeUpdateMessageText({ messageDb });
    const updateMessageTextController = makeUpdateMessageTextController({
        updateMessageText,
    });

    afterEach(async () => {
        await clearDb("group_messages");
    });

    test("SUCCESS: updated message text", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: message.messageId,
                updateValue: "Coder's are cool",
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const updatedMessage = await updateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.data?.text).toBe("Coder's are cool");
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: "",
                updateValue: new Date().toString(),
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const updatedMessage = await updateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: text missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: message.messageId,
                updateValue: "",
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);
        const updatedMessage = await updateMessageTextController(
            messageRequest
        );
        expect(updatedMessage.body.error).toBe(
            "Update Value needs to be supplied."
        );
    });
});
