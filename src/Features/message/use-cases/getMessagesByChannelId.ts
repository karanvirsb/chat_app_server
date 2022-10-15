import { IMakeMessageDb } from "../data-access/message-db";
import { IMessage } from "../message";

type props = {
    messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IMessage[] | undefined;
    error: string;
}>;

export default function makeGetMessagesByChannelId({ messageDb }: props) {
    return async function getMessagesByChannelId(
        messageId: string,
        dateCreated: Date,
        limit: number = 15
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!dateCreated) throw new Error("Date Created needs to be supplied.");

        return messageDb.getMessagesByChannelId(messageId, dateCreated, limit);
    };
}
