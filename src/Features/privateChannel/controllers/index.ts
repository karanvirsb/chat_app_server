import privateChannelService from "../use-cases";
import makeCreatePrivateChannelController from "./create-privateChannel";
import makeDeletePrivateChannelController from "./delete-privateChannel";
import makeGetPrivateChannelByIdController from "./get-privateChannelById";
import makeGetPrivateChannelsByUserIdController from "./get-privateChannelsByUserId";

const createPrivateChannelController = makeCreatePrivateChannelController({
    createPrivateChannel: privateChannelService.createPrivateChannel,
});
const deletePrivateChannelController = makeDeletePrivateChannelController({
    deletePrivateChannel: privateChannelService.deletePrivateChannel,
});
const getPrivateChannelByIdController = makeGetPrivateChannelByIdController({
    getPrivateChannelById: privateChannelService.getPrivateChannelById,
});
const getPrivateChannelsByUserIdController =
    makeGetPrivateChannelsByUserIdController({
        getPrivateChannelsByUserId:
            privateChannelService.getPrivateChannelsByUserId,
    });

const privateChannelControllers = Object.freeze({
    createPrivateChannelController,
    deletePrivateChannelController,
    getPrivateChannelByIdController,
    getPrivateChannelsByUserIdController,
});

export default privateChannelControllers;

export {
    createPrivateChannelController,
    deletePrivateChannelController,
    getPrivateChannelByIdController,
    getPrivateChannelsByUserIdController,
};
