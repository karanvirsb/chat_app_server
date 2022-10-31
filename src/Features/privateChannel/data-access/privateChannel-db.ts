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

export interface IMakePrivateChannelDb {
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
            userId: string
        ) => Promise<returningPrivateChannelsData>;
    }>;
}

export default function makePrivateChannelDb({
    makeDb,
}: props): IMakePrivateChannelDb["returnType"] {
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
    async function getPrivateChannelById(
        channelId: string
    ): Promise<returningPrivateChannelData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM private_channels WHERE "channelId" = '${channelId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const private_channels: IPrivateChannel = res.rows[0];
                private_channels.dateCreated = new Date(
                    private_channels.dateCreated
                );
                return { success: true, data: private_channels, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the private_channels.",
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
    async function getPrivateChannelsByUserId(
        userId: string
    ): Promise<returningPrivateChannelsData> {
        const db = await makeDb();
        try {
            const query = `
            SELECT * FROM private_channels 
            WHERE "userId" = '${userId}'
            ORDER BY "dateCreated" DESC;`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const privateChannels: IPrivateChannel[] = res.rows;
                for (const channel of privateChannels) {
                    channel.dateCreated = new Date(channel.dateCreated);
                }
                return { success: true, data: privateChannels, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find privateChannels with that groupId.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 209 ~ error ~ getPrivateChannelsById",
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
