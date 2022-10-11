import { IId } from "../../Utilities/id";

export interface IMessage {
    userId: string;
    dateCreated: Date;
    messageId: string;
    dateModified?: string;
    published: boolean;
    replyTo?: string;
    text: string;
    channelId: string;
}

type props = {
    Id: IId;
    sanitizeText: (text: string) => string;
};

export default function buildMessage({ Id, sanitizeText }: props) {
    return function makeMessage({
        userId,
        dateCreated = new Date(),
        messageId = Id.makeId(),
        dateModified,
        replyTo,
        text,
        channelId,
    }: IMessage) {
        const sanitizedText = sanitizeText(text);

        if (sanitizedText.length < 1)
            throw new Error("Enter valid characters to send a message.");

        if (sanitizedText.length < 1 || sanitizedText.length > 200)
            throw new Error(
                "Messages can only be between 1 and 200 characters long"
            );

        if (!userId) throw new Error("User Id needs to be supplied");
        if (!dateCreated) throw new Error("Date Created needs to be supplied");
        if (!messageId) throw new Error("Message Id needs to be supplied");
        if (!channelId) throw new Error("Channel Id needs to be supplied");

        return Object.freeze({
            getUserId: () => userId,
            getDateCreated: () => dateCreated,
            getMessageId: () => messageId,
            getDateModified: () => dateModified,
            getReplyTo: () => replyTo,
            getText: () => text,
            getChannelId: () => channelId,
        });
    };
}
