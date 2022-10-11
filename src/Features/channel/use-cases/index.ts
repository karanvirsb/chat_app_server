import { moderateName } from "../../../Utilities/moderateText";
import makeCreateChannel from "./createChannel";
import { handleModerationType } from "./createChannel";
import channelDb from "../data-access";
const handleModeration: handleModerationType = async (channelName: string) => {
    return await moderateName(channelName);
};

const createChannel = makeCreateChannel({ handleModeration, channelDb });

const channelService = Object.freeze({
    createChannel,
});

export default channelService;

export { createChannel };
