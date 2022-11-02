import { IMakePrivateMessageDb } from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";

type props = {
    messageDb: IMakePrivateMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateMessage[] | undefined;
    error: string;
}>;

export interface IGetPrivateMessagesByChannelIdUseCase {
    getPrivateMessagesByChannelId: (
        messageId: string,
        dateCreated: Date,
        limit: number
    ) => returnData;
}

export default function makeGetPrivateMessagesByChannelId({
    messageDb,
}: props) {
    return async function getPrivateMessagesByChannelId(
        messageId: string,
        dateCreated: Date,
        limit: number = 15
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!dateCreated || Number.isNaN(dateCreated.getTime()))
            throw new Error("Date Created needs to be supplied.");

        return messageDb.getPrivateMessagesByChannelId(
            messageId,
            dateCreated,
            limit
        );
    };
}
