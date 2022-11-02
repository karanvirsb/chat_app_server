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

export interface IUpdatePrivateMessageTextUseCase {
    updatePrivateMessageText: (
        messageId: string,
        updateValue: string
    ) => returnData;
}

export default function makeUpdatePrivateMessageText({ messageDb }: props) {
    return async function updatePrivateMessageText(
        messageId: string,
        updateValue: string
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!updateValue) throw new Error("Update Value needs to be supplied.");
        const regex = /'/g;

        // replace any ' with a '' to escape
        const newUpdateValue = "'" + updateValue.replace(regex, "''") + "'";

        return messageDb.updatePrivateMessage(
            "text",
            messageId,
            newUpdateValue
        );
    };
}
