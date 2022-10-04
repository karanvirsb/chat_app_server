import { moderateName } from "../../../Utilities/moderateText";
import groupDb from "../data-access";
import makeAddGroup from "./addGroup";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addGroup = makeAddGroup({ groupDb, handleModeration });

const userService = Object.freeze({
    addGroup,
});

export default userService;

export { addGroup };
