import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeGetMessagesByChannelId from "../use-cases/getMessagesByChannelId";
import makeGetMessagesByChannelIdController from "./get-messagesByChannelId";

describe.skip("getting messages by channel id controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const getMessagesByChannelId = makeGetMessagesByChannelId({ messageDb });
    const getMessagesByChannelIdController =
        makeGetMessagesByChannelIdController({
            getMessagesByChannelId,
        });

    afterEach(async () => {
        await clearDb("messaget");
    });

    test("SUCCESS: getting a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: message.messageId,
                dateCreated: message.dateCreated.toString(),
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessage = await getMessagesByChannelIdController(
            messageRequest
        );
        if (foundMessage.body.data)
            expect(foundMessage.body.data[0].text).toBe(message.text);
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: "",
                dateCreated: message.dateCreated.toString(),
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessages = await getMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: date created missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "",
            params: {
                messageId: message.messageId,
                dateCreated: "",
                limit: "10",
            },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessages = await getMessagesByChannelIdController(
            messageRequest
        );

        expect(foundMessages.body.error).toBe(
            "Date Created needs to be supplied."
        );
    });
});
