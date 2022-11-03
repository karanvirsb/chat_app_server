import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeGetMessageById from "../use-cases/getMessageById";
import makeGetMessageByIdController from "./get-messageById";

describe.skip("getting a message by id controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const getMessageById = makeGetMessageById({ messageDb });
    const getMessageByIdController = makeGetMessageByIdController({
        getMessageById,
    });

    afterEach(async () => {
        await clearDb("group_messages");
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
            params: { messageId: message.messageId },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessage = await getMessageByIdController(messageRequest);
        expect(foundMessage.body.data?.text).toBe(message.text);
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
            params: { messageId: "" },
            path: "",
            query: {},
        };

        const createdMessage = await createMessage(message);

        const foundMessage = await getMessageByIdController(messageRequest);
        expect(foundMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });
});