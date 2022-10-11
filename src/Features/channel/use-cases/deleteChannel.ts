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

export default function makeDeleteChannel({ channelDb }: props) {
    return async function deleteChannel(
        channelId: string
    ): Promise<returnData> {
        if (!channelId) throw new Error("Channel Id needs to be supplied");

        return await channelDb.deleteChannel(channelId);
    };
}
