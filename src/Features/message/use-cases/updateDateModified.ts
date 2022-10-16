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

export interface IUpdateDateModifiedUseCase {
    updateDateModified: (messageId: string, updateValue: Date) => returnData;
}

export default function makeUpdateDateModified({ messageDb }: props) {
    return async function updateDateModified(
        messageId: string,
        updateValue: Date
    ): returnData {
        if (!messageId) throw new Error("Message Id needs to be supplied.");
        if (!updateValue) throw new Error("Update Value needs to be supplied.");

        // need to convert date
        const newUpdateValue = `to_timestamp(${updateValue.getTime() / 1000})`;

        return messageDb.updateMessage(
            "dateCreated",
            messageId,
            newUpdateValue
        );
    };
}
