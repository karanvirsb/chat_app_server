import groupService from "../use-cases";
import makeAddGroupController from "./add-group";
import makeDeleteGroupController from "./delete-group";
import makeGetGroupByIdController from "./get-byGroupId";
import makeGetGroupByInviteCodeController from "./get-byGroupInviteCode";

const addGroupController = makeAddGroupController({
    addGroup: groupService.addGroup,
});
const deleteGroupController = makeDeleteGroupController({
    deleteGroup: groupService.deleteGroup,
});
const getGroupByIdController = makeGetGroupByIdController({
    getGroupById: groupService.getGroupById,
});

const getGroupByInviteCodeController = makeGetGroupByInviteCodeController({
    getGroupByInviteCode: groupService.getGroupByInviteCode,
});

const groupControllers = Object.freeze({
    addGroupController,
    deleteGroupController,
    getGroupByIdController,
    getGroupByInviteCodeController,
});

export default groupControllers;

export {
    addGroupController,
    deleteGroupController,
    getGroupByIdController,
    getGroupByInviteCodeController,
};
