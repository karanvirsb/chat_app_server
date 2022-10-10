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

export interface IMakeChannelDb {
    returnType: Readonly<{
        createChannel: (channelInfo: IChannel) => Promise<returningChannelData>;
        deleteChannel: (channelId: string) => Promise<returningChannelData>;
    }>;
}

export default function makeChannelDb({
    makeDb,
}: props): IMakeChannelDb["returnType"] {
    return Object.freeze({
        createChannel,
        deleteChannel,
    });

    // create channel (channelInfo);
    async function createChannel(
        channelInfo: IChannel
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO channelt VALUES (
                ${channelInfo.channelId}, 
                ${channelInfo.channelName}, 
                ${channelInfo.dateCreated}, 
                ${channelInfo.groupId}
                ) RETURNNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IChannel = res.rows[0];
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not create the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 54 ~ error ~ createChannel",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
    // delete channel (channelId);
    async function deleteChannel(
        channelId: string
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM channelt WHERE "channelId" = ${channelId}) RETURNNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IChannel = res.rows[0];
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 84 ~ error ~ deleteChannel",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    // update channelName (channelId, newName);
    // get channel by Id (channelId);
    // get Channels by group Id (groupId);
}
