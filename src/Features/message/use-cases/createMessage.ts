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

export interface ICreateMessageUseCase {
    createMessage: (messageInfo: IMessage) => returnData;
}

export default function makeCreateMessage({ messageDb }: props) {
    return async function createMessage(messageInfo: IMessage): returnData {
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
