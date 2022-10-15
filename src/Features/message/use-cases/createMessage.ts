import { IMakeMessageDb } from "../data-access/message-db";
import { IMessage } from "../message";
import makeMessage from "../index";

type props = {
    messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IMessage | undefined;
    error: string;
}>;

export default function makeCreateMessage({ messageDb }: props) {
    return async function createMessage(messageInfo: IMessage): returnData {
        if (!messageInfo.channelId)
            throw new Error("Channel Id needs to be supplied.");
        if (!messageInfo.text) throw new Error("Text needs to be supplied.");
        if (!messageInfo.userId)
            throw new Error("User Id needs to be supplied.");

        const message = makeMessage(messageInfo);

        return messageDb.createMessage({
            channelId: message.getChannelId(),
            dateCreated: message.getDateCreated(),
            messageId: message.getMessageId(),
            text: message.getText(),
            userId: message.getUserId(),
        });
    };
}
