import { moderateName } from "../../../Utilities/moderateText";
import makeCreateChannel from "./createChannel";
import { handleModerationType } from "./createChannel";
import channelDb from "../data-access";
import makeDeleteChannel from "./deleteChannel";
const handleModeration: handleModerationType = async (channelName: string) => {
    return await moderateName(channelName);
};

const createChannel = makeCreateChannel({ handleModeration, channelDb });
const deleteChannel = makeDeleteChannel({ channelDb });

const channelService = Object.freeze({
    createChannel,
    deleteChannel,
});

export default channelService;

export { createChannel, deleteChannel };
