import sanitizeHtml from "sanitize-html";
import { moderateName } from "../../../Utilities/moderateText";
import groupDb from "../data-access";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";
import makeGetUsersByGroupId from "./getUsersByGroupId";
import makeUpdateGroupName from "./updateGroupName";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}
const addGroup = makeAddGroup({ groupDb, handleModeration });
const getGroupById = makeGetGroupById({ groupDb });
const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
const getUsersByGroupId = makeGetUsersByGroupId({ groupDb });
const updateGroupName = makeUpdateGroupName({
    groupDb,
    handleModeration,
    sanitizeName: sanitizeText,
});

const userService = Object.freeze({
    addGroup,
    getGroupById,
    getGroupByInviteCode,
    getUsersByGroupId,
    updateGroupName,
});

export default userService;

export { addGroup, getGroupById, getGroupByInviteCode, updateGroupName };
