import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "./message-db";

describe("Message db method tests", () => {
    jest.setTimeout(10000);
    const messageDB = makeMessageDb({ makeDb });

    afterEach(async () => {
        await clearDb("group_messages");
    });

    test.skip("SUCCESS: creating a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createMessage(message);
        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test.skip("SUCCESS: deleting a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createMessage(message);
        const deletedMessage = await messageDB.deleteMessage(message.messageId);
        expect(deletedMessage.data?.messageId).toBe(message.messageId);
    });

    test.skip("SUCCESS: getting message by id", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createMessage(message);
        const foundMessage = await messageDB.getMessageById(message.messageId);
        expect(foundMessage.data?.text).toBe(message.text);
    });

    test.skip("SUCCESS: getting messages by channel id", async () => {
        jest.setTimeout(30000);
        let message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        let insertedMessage = await messageDB.createMessage(message);
        for (let i = 0; i < 10; i++) {
            message = await makeFakeMessage(
                "123",
                "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
            );

            insertedMessage = await messageDB.createMessage(message);
        }
        const foundMessages = await messageDB.getMessagesByChannelId(
            "123",
            message.dateCreated,
            10
        );
        console.log(foundMessages);
        if (foundMessages.data)
            expect(foundMessages.data[0].text).toBe(message.text);
    });

    test("SUCCESS: updating message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createMessage(message);
        const updatedMessage = await messageDB.updateMessage(
            "text",
            message.messageId,
            "'Coders are cool'"
        );
        expect(updatedMessage.data?.text).toBe("Coders are cool");
    });

    test("SUCCESS: updating message date", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        const insertedMessage = await messageDB.createMessage(message);
        const updatedMessage = await messageDB.updateMessage(
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
