import { IChannelDb } from ".";
import { IChannel } from "../channel";

type props = {
    makeDb: IChannelDb["makeDb"];
};

type returningChannelData = Promise<{
    success: boolean;
    data: IChannel | undefined;
    error: string;
}>;

export default function makeChannelDb({ makeDb }: props) {}

// create channel (channelInfo, groupId);
// delete channel (channelId);
// update channelName (channelId, newName);
// get channel by Id (channelId);
// get Channels by group Id (groupId);
