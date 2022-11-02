import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makeCreatePrivateChannel from "../../privateChannel/use-cases/createPrivateChannel";
import makePrivateMessageDb from "./privateMessage-db";

describe("Private Message db method tests", () => {
    jest.setTimeout(10000);
    const messageDB = makePrivateMessageDb({ makeDb });

    beforeAll(async () => {
        const privateChannelDb = makePrivateChannelDb({ makeDb });
        const privChannel = await privateChannelDb.createPrivateChannel({
            channelId: "123",
            channelName: "coders",
            dateCreated: new Date(),
            friendsId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    afterEach(async () => {
        await clearDb("private_messages");
    });

    test("SUCCESS: creating a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createPrivateMessage(message);
        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test("SUCCESS: deleting a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createPrivateMessage(message);
        const deletedMessage = await messageDB.deletePrivateMessage(
            message.messageId
        );
        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test("SUCCESS: getting message by id", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createPrivateMessage(message);
        const foundMessage = await messageDB.getPrivateMessageById(
            message.messageId
        );
        expect(foundMessage.data?.text).toBe(message.text);
    });

    test("SUCCESS: getting messages by channel id", async () => {
        jest.setTimeout(30000);
        let message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        let insertedMessage = await messageDB.createPrivateMessage(message);

        for (let i = 0; i < 5; i++) {
            message = await makeFakePrivateMessage(
                "123",
                "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
            );
            await messageDB.createPrivateMessage(message);
        }
        const foundMessages = await messageDB.getPrivateMessagesByChannelId(
            "123",
            message.dateCreated,
            10
        );
        console.log(foundMessages);
        if (foundMessages.data)
            expect(foundMessages.data[0].text).toBe(insertedMessage.data?.text);
    });

    test("SUCCESS: updating message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createPrivateMessage(message);
        const updatedMessage = await messageDB.updatePrivateMessage(
            "text",
            message.messageId,
            "'Coders are cool'"
        );
        expect(updatedMessage.data?.text).toBe("Coders are cool");
    });

    test("SUCCESS: updating message date", async () => {
        jest.setTimeout(30000);
        const message = await makeFakePrivateMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createPrivateMessage(message);
        const updatedMessage = await messageDB.updatePrivateMessage(
            "dateModified",
            message.messageId,
            `to_timestamp(${new Date().getTime() / 1000})`
        );
        console.log(updatedMessage);
        expect(updatedMessage.data?.dateModified).not.toEqual(
            message.dateModified
        );
    });
});
