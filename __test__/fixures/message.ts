import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IMessage } from "../../src/Features/message/message";

export default async function makeFakeMessage(
    channelId: string,
    userId: string
): Promise<IMessage> {
    return {
        channelId: channelId,
        dateCreated: new Date(),
        messageId: cuid(),
        text: faker.lorem.lines(1),
        userId: userId,
        dateModified: new Date(),
        replyTo: "",
    };
}
