import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import makeChannel from "../index";
import { IPrivateChannel } from "../privateChannel";

export type handleModerationType = {
    (name: string): Promise<number | boolean>;
};

type props = {
    privateChannelDb: IMakePrivateChannelDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel | undefined;
    error: string;
}>;

export interface ICreatePrivateChannelUseCase {
    createChannel: (channelInfo: IPrivateChannel) => Promise<returnData>;
}

export default function makeCreateChannel({
    handleModeration,
    privateChannelDb,
}: props): ICreatePrivateChannelUseCase["createChannel"] {
    return async function createPrivateChannel(
        channelInfo: IPrivateChannel
    ): Promise<returnData> {
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

        const privateChannelExists =
            await privateChannelDb.getPrivateChannelById(
                channel.getChannelId()
            );

        if (
            privateChannelExists.success &&
            privateChannelExists.data !== undefined
        ) {
            return {
                success: true,
                data: undefined,
                error: "Private Channel already exists, try again.",
            };
        }

        return await privateChannelDb.createPrivateChannel({
            channelId: channel.getChannelId(),
            channelName: channel.getChannelName(),
            dateCreated: channel.getDateCreated(),
            userId: channel.getUserId(),
            friendsId: channel.getFriendsId(),
        });
    };
}
