import { moderateName } from "../../../Utilities/moderateText";
import groupDb from "../data-access";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addGroup = makeAddGroup({ groupDb, handleModeration });
const getGroupById = makeGetGroupById({ groupDb });
const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });

const userService = Object.freeze({
    addGroup,
    getGroupById,
    getGroupByInviteCode,
});

export default userService;

export { addGroup, getGroupById, getGroupByInviteCode };
