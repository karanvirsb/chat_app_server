import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";

describe("Create private message use case", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createMessage = makeCreatePrivateMessage({ privateMessageDb });

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
        clearDb("private_messages");
    });

    test("SUCCESS: creating a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channelId not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.privateChannelId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied.");
        }
    });

    test("ERROR: text not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.text = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Text needs to be supplied.");
        }
    });

    test("ERROR: user id not given", async () => {
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        try {
            message.userId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied.");
        }
    });
});
