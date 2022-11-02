import { IMakePrivateMessageDb } from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";

type props = {
    messageDb: IMakePrivateMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateMessage | undefined;
    error: string;
}>;

export interface IDeletePrivateMessageUseCase {
    deletePrivateMessage: (messageId: string) => returnData;
}

export default function makeDeletePrivateMessage({ messageDb }: props) {
    return async function deletePrivateMessage(messageId: string): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");

        return messageDb.deletePrivateMessage(messageId);
    };
}
