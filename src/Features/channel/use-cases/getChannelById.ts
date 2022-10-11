import { IChannel } from "../channel";
import { IMakeChannelDb } from "../data-access/channel-db";

type props = {
    channelDb: IMakeChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IChannel | undefined;
    error: string;
}>;

export default function makeGetChannelById({ channelDb }: props) {
    return async function getChannelById(
        channelId: string
    ): Promise<returnData> {
        if (!channelId) throw new Error("Channel Id needs to be supplied");

        return await channelDb.getChannelById(channelId);
    };
}
