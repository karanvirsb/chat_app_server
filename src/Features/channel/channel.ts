import { IId } from "../../Utilities/id";

export interface IChannel {
    channelId: string;
    channelName: string;
    dateCreated: string;
    groupId: string;
}

type props = {
    Id: IId;
    sanitizeText: (text: string) => string;
};

export default function buildChannel({ Id, sanitizeText }: props) {
    return function makeChannel({
        channelId = Id.makeId(),
        channelName,
        groupId,
        dateCreated = new Date().toLocaleDateString(),
    }: IChannel) {
        const sanitizedChannelName = sanitizeText(channelName);

        if (sanitizedChannelName.length <= 1) {
            throw new Error("Channel name should contain valid characters");
        }

        if (
            sanitizedChannelName.length < 3 ||
            sanitizedChannelName.length > 50
        ) {
            throw new Error(
                "Channel name should be between 3 to 50 characters long"
            );
        }

        if (!groupId) {
            throw new Error("Group Id needs to be supplied");
        }

        if (!dateCreated) {
            throw new Error("Date needs to be supplied");
        }

        if (!channelId) {
            throw new Error("Channel Id needs to be supplied");
        }

        return Object.freeze({
            getChannelId: () => channelId,
            getChannelName: () => channelName,
            getGroupId: () => groupId,
            getDateCreated: () => dateCreated,
        });
    };
}