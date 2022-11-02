import { IMakeMessageDb } from "../data-access/message-db";
import { IMessage } from "../groupMessage";

type props = {
    messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IMessage[] | undefined;
    error: string;
}>;

export interface IGetMessagesByChannelIdUseCase {
    getMessagesByChannelId: (
        messageId: string,
        dateCreated: Date,
        limit: number
    ) => returnData;
}

export default function makeGetMessagesByChannelId({ messageDb }: props) {
    return async function getMessagesByChannelId(
        messageId: string,
        dateCreated: Date,
        limit: number = 15
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!dateCreated || Number.isNaN(dateCreated.getTime()))
            throw new Error("Date Created needs to be supplied.");

        return messageDb.getMessagesByChannelId(messageId, dateCreated, limit);
    };
}
