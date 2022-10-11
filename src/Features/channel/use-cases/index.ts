import { moderateName } from "../../../Utilities/moderateText";
import makeCreateChannel from "./createChannel";
import { handleModerationType } from "./createChannel";
import channelDb from "../data-access";
import makeDeleteChannel from "./deleteChannel";
import makeUpdateChannelName from "./updateChannelName";
import makeGetChannelById from "./getChannelById";
const handleModeration: handleModerationType = async (channelName: string) => {
    return await moderateName(channelName);
};

const createChannel = makeCreateChannel({ handleModeration, channelDb });
const deleteChannel = makeDeleteChannel({ channelDb });
const updateChannelName = makeUpdateChannelName({
    handleModeration,
    channelDb,
});
const getChannelById = makeGetChannelById({ channelDb });

const channelService = Object.freeze({
    createChannel,
    deleteChannel,
    updateChannelName,
    getChannelById,
});

export default channelService;

export { createChannel, deleteChannel, updateChannelName, getChannelById };
