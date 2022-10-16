import { IMakeMessageDb } from "../data-access/message-db";
import { IMessage } from "../message";

type props = {
    messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IMessage | undefined;
    error: string;
}>;

export interface IDeleteMessageUseCase {
    deleteMessage: (messageId: string) => returnData;
}

export default function makeDeleteMessage({ messageDb }: props) {
    return async function deleteMessage(messageId: string): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");

        return messageDb.deleteMessage(messageId);
    };
}
