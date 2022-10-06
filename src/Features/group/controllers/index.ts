import groupService from "../use-cases";
import makeAddGroupController from "./add-group";
import makeDeleteGroupController from "./delete-group";

const addGroupController = makeAddGroupController({
    addGroup: groupService.addGroup,
});
const deleteGroupController = makeDeleteGroupController({
    deleteGroup: groupService.deleteGroup,
});

const groupControllers = Object.freeze({
    addGroupController,
    deleteGroupController,
});

export default groupControllers;

export { addGroupController, deleteGroupController };
