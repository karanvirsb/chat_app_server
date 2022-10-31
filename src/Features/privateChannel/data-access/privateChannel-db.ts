import { IPrivateChannelDb } from ".";
import { IPrivateChannel } from "../privateChannel";

type props = {
    makeDb: IPrivateChannelDb["makeDb"];
};

type returningPrivateChannelData = Promise<{
    success: boolean;
    data: IPrivateChannel | undefined;
    error: string;
}>;

type returningPrivateChannelsData = Promise<{
    success: boolean;
    data: IPrivateChannel[] | undefined;
    error: string;
}>;

export interface IMakeChannelDb {
    returnType: Readonly<{
        createPrivateChannel: (
            channelInfo: IPrivateChannel
        ) => Promise<returningPrivateChannelData>;
        deletePrivateChannel: (
            channelId: string
        ) => Promise<returningPrivateChannelData>;

        getPrivateChannelById: (
            channelId: string
        ) => Promise<returningPrivateChannelData>;
        getPrivateChannelsByUserId: (
            groupId: string
        ) => Promise<returningPrivateChannelsData>;
    }>;
}

export default function makePrivateChannelDb({
    makeDb,
}: props): IMakeChannelDb["returnType"] {
    return Object.freeze({
        createPrivateChannel,
        deletePrivateChannel,
        getPrivateChannelById,
        getPrivateChannelsByUserId,
    });

    // create channel (channelInfo);
    async function createPrivateChannel(
        channelInfo: IPrivateChannel
    ): Promise<returningPrivateChannelData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO private_channels VALUES (
                '${channelInfo.channelId}', 
                '${channelInfo.channelName}', 
                to_timestamp(${channelInfo.dateCreated.getTime()}/1000), 
                '${channelInfo.userId}',
                '${channelInfo.friendsId}'
                ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const privateChannel: IPrivateChannel = res.rows[0];
                privateChannel.dateCreated = new Date(
                    privateChannel.dateCreated
                );
                return { success: true, data: privateChannel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not create the private channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 54 ~ error ~ createPrivateChannel",
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
    async function deletePrivateChannel(
        channelId: string
    ): Promise<returningPrivateChannelData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM private_channels WHERE "channelId" = '${channelId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const privateChannel: IPrivateChannel = res.rows[0];
                return { success: true, data: privateChannel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete the private channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 84 ~ error ~ deletePrivateChannel",
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

    // get channel by Id (channelId);
    async function getChannelById(
        channelId: string
    ): Promise<returningPrivateChannelData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM channelt WHERE "channelId" = '${channelId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IPrivateChannel = res.rows[0];
                channel.dateCreated = new Date(channel.dateCreated);
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 165 ~ error ~ getChannelById",
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
    // get Channels by group Id (groupId);
    async function getChannelsByGroupId(
        groupId: string
    ): Promise<returningPrivateChannelsData> {
        const db = await makeDb();
        try {
            const query = `
            SELECT * FROM channelt 
            WHERE "groupId" = '${groupId}'
            ORDER BY "dateCreated" DESC;`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const channels: IPrivateChannel[] = res.rows;
                for (const channel of channels) {
                    channel.dateCreated = new Date(channel.dateCreated);
                }
                return { success: true, data: channels, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find channels with that groupId.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 209 ~ error ~ getChannelsById",
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
}
