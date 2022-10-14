import makeFakeChannel from "../../../../__test__/fixures/channel";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeMessageDb from "./message-db";

describe("Message db method tests", () => {
    jest.setTimeout(10000);
    const messageDB = makeMessageDb({ makeDb });

    afterEach(async () => {
        await clearDb("messaget");
    });

    test("SUCCESS: creating a message", async () => {
        jest.setTimeout(30000);
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );

        delete message["dateModified"];
        delete message["replyTo"];

        const insertedMessage = await messageDB.createMessage(message);
        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });
});
