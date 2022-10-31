import privateChannelDb from "../data-access";
import { moderateName } from "../../../Utilities/moderateText";
import makeCreatePrivateChannel, {
    handleModerationType,
} from "./createPrivateChannel";
import makeDeletePrivateChannel from "./deletePrivateChannel";
import makeGetPrivateChannelById from "./getPrivateChannelById";
import makeGetPrivateChannelsByUserId from "./getPrivateChannelsByUserId";

const handleModeration: handleModerationType = async (channelName: string) => {
    return await moderateName(channelName);
};

const createPrivateChannel = makeCreatePrivateChannel({
    handleModeration,
    privateChannelDb,
});
const deletePrivateChannel = makeDeletePrivateChannel({ privateChannelDb });
const getPrivateChannelById = makeGetPrivateChannelById({ privateChannelDb });
const getPrivateChannelsByUserId = makeGetPrivateChannelsByUserId({
    privateChannelDb,
});

const privateChannelService = Object.freeze({
    createPrivateChannel,
    deletePrivateChannel,
    getPrivateChannelById,
    getPrivateChannelsByUserId,
});

export default privateChannelService;

export {
    createPrivateChannel,
    deletePrivateChannel,
    getPrivateChannelById,
    getPrivateChannelsByUserId,
};
