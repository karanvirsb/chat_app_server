import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";

describe("Create message use case", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    afterEach(async () => {
        clearDb("messaget");
    });

    test("SUCCESS: creating a message", async () => {
        const message = await makeFakeMessage("123", "123");
        const insertedMessage = await createMessage(message);

        expect(insertedMessage.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channelId not given", async () => {
        const message = await makeFakeMessage("123", "123");

        try {
            message.channelId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Channel Id needs to be supplied.");
        }
    });

    test("ERROR: text not given", async () => {
        const message = await makeFakeMessage("123", "123");

        try {
            message.text = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Text needs to be supplied.");
        }
    });

    test("ERROR: user id not given", async () => {
        const message = await makeFakeMessage("123", "123");

        try {
            message.userId = "";
            const insertedMessage = await createMessage(message);
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied.");
        }
    });
});
