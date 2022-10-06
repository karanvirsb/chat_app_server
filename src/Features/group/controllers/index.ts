import groupService from "../use-cases";
import makeAddGroupController from "./add-group";

const addGroupController = makeAddGroupController({
    addGroup: groupService.addGroup,
});

const groupControllers = Object.freeze({
    addGroupController,
});

export default groupControllers;

export { addGroupController };
