import { IChannel } from "../channel";
import { IMakeChannelDb } from "../data-access/channel-db";
import makeChannel from "../index";

type props = {
    channelDb: IMakeChannelDb["returnType"];
    handleModeration: (name: string) => Promise<number | boolean>;
};

type returnData = Promise<{
    success: boolean;
    data: IChannel | undefined;
    error: string;
}>;

export default function makeCreateChannel({
    handleModeration,
    channelDb,
}: props) {
    return async function createChannel(
        channelName: string,
        groupId: string
    ): Promise<returnData> {
        if (!channelName) throw new Error("Channel name needs to be supplied");
        if (!groupId) throw new Error("Group Id needs to be supplied");

        const channel = makeChannel({
            channelId: "",
            channelName,
            dateCreated: "",
            groupId,
        });

        const channelExists = await channelDb.getChannelById(
            channel.getChannelId()
        );

        if (channelExists.success && channelExists.data !== undefined) {
            return {
                success: true,
                data: undefined,
                error: "Channel already exists, try again.",
            };
        }

        return await channelDb.createChannel({
            channelId: channel.getChannelId(),
            channelName: channel.getChannelName(),
            dateCreated: channel.getDateCreated(),
            groupId: channel.getGroupId(),
        });
    };
}
