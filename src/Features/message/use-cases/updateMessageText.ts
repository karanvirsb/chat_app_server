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

export default function makeUpdateMessageText({ messageDb }: props) {
    return async function updateMessageText(
        messageId: string,
        updateValue: string
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!updateValue) throw new Error("Update Value needs to be supplied.");

        return messageDb.updateMessage("text", messageId, updateValue);
    };
}
