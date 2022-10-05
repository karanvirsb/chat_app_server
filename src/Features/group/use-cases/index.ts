import { moderateName } from "../../../Utilities/moderateText";
import groupDb from "../data-access";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addGroup = makeAddGroup({ groupDb, handleModeration });
const getGroupById = makeGetGroupById({ groupDb });

const userService = Object.freeze({
    addGroup,
    getGroupById,
});

export default userService;

export { addGroup, getGroupById };
