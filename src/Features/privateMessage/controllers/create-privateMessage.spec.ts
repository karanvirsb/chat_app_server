import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeCreatePrivateMessageController from "./create-privateMessage";

describe("creating a private message controller", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
    const createPrivateMessageController = makeCreatePrivateMessageController({
        createPrivateMessage,
    });

    beforeAll(async () => {
        const privateChannelDb = makePrivateChannelDb({ makeDb });
        const found = await privateChannelDb.getPrivateChannelById("123");
        if (!found.data) {
            await privateChannelDb.createPrivateChannel({
                channelId: "123",
                channelName: "coders",
                dateCreated: new Date(),
                friendsId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
                userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
            });
        }
    });

    afterEach(async () => {
        await clearDb("private_messages");
    });

    test("SUCCESS: create a message", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channel id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe(
            "Channel Id needs to be supplied."
        );
    });

    test("ERROR: user id missing ", async () => {
        const message = await makeFakePrivateMessage("123", "");
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: text id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe("Text needs to be supplied.");
    });
});
