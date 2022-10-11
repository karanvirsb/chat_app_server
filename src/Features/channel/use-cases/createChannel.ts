import { IChannel } from "../channel";
import { IMakeChannelDb } from "../data-access/channel-db";
import makeChannel from "../index";

export type handleModerationType = {
    (name: string): Promise<number | boolean>;
};

type props = {
    channelDb: IMakeChannelDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IChannel | undefined;
    error: string;
}>;

export interface ICreateChannelUseCase {
    createChannel: (channelInfo: IChannel) => Promise<returnData>;
}

export default function makeCreateChannel({
    handleModeration,
    channelDb,
}: props): ICreateChannelUseCase["createChannel"] {
    return async function createChannel(
        channelInfo: IChannel
    ): Promise<returnData> {
        if (!channelInfo.channelName)
            throw new Error("Channel name needs to be supplied");
        if (!channelInfo.groupId)
            throw new Error("Group Id needs to be supplied");

        const channel = makeChannel(channelInfo);

        const moderatedName = await handleModeration(channel.getChannelName());

        if (moderatedName) {
            return {
                success: false,
                data: undefined,
                error: "Channel name contains profanity",
            };
        }

        if (moderatedName === -1) {
            return {
                success: false,
                data: undefined,
                error: "Server Error, please try again.",
            };
        }

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
