import { IMessageDb } from ".";
import { IMessage } from "../message";

type props = {
    makeDb: IMessageDb["makeDb"];
};

type returningMessageData = Promise<{
    success: boolean;
    data: IMessage | undefined;
    error: string;
}>;

type returningMessagesData = Promise<{
    success: boolean;
    data: IMessage[] | undefined;
    error: string;
}>;

export interface IMakeMessageDb {
    returnType: Readonly<{
        createMessage: (messageInfo: IMessage) => Promise<returningMessageData>;
        deleteMessage: (messageId: string) => Promise<returningMessageData>;
        getMessageById: (messageId: string) => Promise<returningMessageData>;
        getMessagesByChannelId: (
            channelId: string,
            dateCreated: Date,
            limit: number
        ) => Promise<returningMessagesData>;
        updateMessage: (
            updateName: keyof IMessage,
            messageId: string,
            updateValue: IMessage[typeof updateName]
        ) => Promise<returningMessageData>;
    }>;
}

export default function makeMessageDb({
    makeDb,
}: props): IMakeMessageDb["returnType"] {
    return Object.freeze({
        createMessage,
        deleteMessage,
        getMessageById,
        getMessagesByChannelId,
        updateMessage,
    });

    // create message
    async function createMessage(
        messageInfo: IMessage
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO messaget VALUES (
                '${messageInfo.messageId}',
                to_timestamp(${messageInfo.dateCreated.getTime()}/1000),
                null,
                null,
                '${messageInfo.text}', 
                '${messageInfo.userId}', 
                '${messageInfo.channelId}'
                ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IMessage = res.rows[0];
                message.dateCreated = new Date(message.dateCreated);
                return { success: true, data: message, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not create the message.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: message-db.ts ~ line 54 ~ error ~ createMessage",
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
    // delete message
    async function deleteMessage(
        messageId: string
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM messaget WHERE "messageId" = '${messageId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IMessage = res.rows[0];
                message.dateCreated = new Date(message.dateCreated);
                return { success: true, data: message, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete the message.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: message-db.ts ~ line 54 ~ error ~ deleteMessage",
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
    // get message by id

    async function getMessageById(
        messageId: string
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM messaget WHERE "messageId" = '${messageId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IMessage = res.rows[0];
                message.dateCreated = new Date(message.dateCreated);
                return { success: true, data: message, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the message.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: message-db.ts ~ line 54 ~ error ~ getMessageById",
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

    // get messages by channel id

    async function getMessagesByChannelId(
        channelId: string,
        dateCreated: Date,
        limit: number
    ): Promise<returningMessagesData> {
        const db = await makeDb();
        try {
            const query = `
                SELECT * FROM messaget 
                WHERE "channelId" = '${channelId}' AND "dateCreated" < to_timestamp(${
                dateCreated.getTime() / 1000
            }) 
                ORDER BY "dateCreated" DESC 
                LIMIT ${limit};`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const message: IMessage[] = res.rows;
                return { success: true, data: message, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the message.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: message-db.ts ~ line 54 ~ error ~ getMessagesByChannelId",
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
    // update message
    async function updateMessage(
        updateName: Partial<keyof IMessage>,
        messageId: string,
        updateValue: IMessage[typeof updateName]
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `
            UPDATE messaget 
            SET "${updateName}" = ${updateValue} 
            WHERE "messageId" = '${messageId}' RETURNING *;`;

            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IMessage = res.rows[0];
                message.dateCreated = new Date(message.dateCreated);
                return { success: true, data: message, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the message.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: message-db.ts ~ line 54 ~ error ~ getMessagesByChannelId",
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
