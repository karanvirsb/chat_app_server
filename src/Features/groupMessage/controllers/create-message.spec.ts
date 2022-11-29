import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeCreateMessageController from "./create-message";

describe("creating a message controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const createMessageController = makeCreateMessageController({
        createMessage,
    });

    afterEach(async () => {
        await clearDb("group_messages");
    });

    test("SUCCESS: create a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channel id missing ", async () => {
        const message = await makeFakeMessage(
            "",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe(
            "Channel Id needs to be supplied."
        );
    });

    test("ERROR: user id missing ", async () => {
        const message = await makeFakeMessage("123", "");
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: text id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        message.text = "";
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe("Text needs to be supplied.");
    });
});
