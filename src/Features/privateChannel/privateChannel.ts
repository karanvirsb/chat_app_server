import { IId } from "../../Utilities/id";

export interface IPrivateChannel {
    channelId: string;
    channelName: string;
    dateCreated: Date;
    userId: string;
    friendsId: string;
}

type props = {
    Id: IId;
    sanitizeText: (text: string) => string;
};

export default function buildPrivateChannel({ Id, sanitizeText }: props) {
    return function makePrivateChannel({
        channelId = Id.makeId(),
        channelName,
        userId,
        friendsId,
        dateCreated = new Date(),
    }: IPrivateChannel) {
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

        if (!userId) {
            throw new Error("User Id needs to be supplied");
        }

        if (!friendsId) throw new Error("Friends Id needs to be supplied");

        if (!dateCreated) {
            throw new Error("Date needs to be supplied");
        }

        if (!channelId) {
            throw new Error("Channel Id needs to be supplied");
        }

        return Object.freeze({
            getChannelId: () => channelId,
            getChannelName: () => channelName,
            getUserId: () => userId,
            getFriendsId: () => friendsId,
            getDateCreated: () => dateCreated,
        });
    };
}
