import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeUpdateDateModified from "../use-cases/updateDateModified";
import makeUpdateDateModifiedController from "./update-dateModified";

describe("updating private message date modified controller", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });

    const updateDateModified = makeUpdateDateModified({ privateMessageDb });
    const updateDateModifiedController = makeUpdateDateModifiedController({
        updateDateModified,
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

    test("SUCCESS: updated date modified", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageId: message.messageId,
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

        const updatedMessage = await updateDateModifiedController(
            messageRequest
        );

        expect(updatedMessage.body.data?.dateModified).not.toEqual(
            message.dateModified
        );
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const updatedMessage = await updateDateModifiedController(
            messageRequest
        );

        expect(updatedMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: date modified missing ", async () => {
        const message = await makeFakePrivateMessage(
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
        const updatedMessage = await updateDateModifiedController(
            messageRequest
        );
        expect(updatedMessage.body.error).toBe(
            "Update Value needs to be a Date."
        );
    });
});
