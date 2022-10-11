import { IChannel } from "../channel";
import { IMakeChannelDb } from "../data-access/channel-db";

type props = {
    channelDb: IMakeChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IChannel[] | undefined;
    error: string;
}>;

export default function makeGetChannelsByGroupId({ channelDb }: props) {
    return async function getChannelsByGroupId(
        groupId: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        return await channelDb.getChannelsByGroupId(groupId);
    };
}
