import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IChannel } from "../../src/Features/channel/channel";

export default async function makeFakeChannel(): Promise<IChannel> {
    return {
        channelId: cuid(),
        channelName: faker.animal.cat().toString(),
        dateCreated: new Date().toLocaleDateString(),
        groupId: cuid(),
    };
}
