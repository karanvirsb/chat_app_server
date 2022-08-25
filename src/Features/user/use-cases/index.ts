import makeAddUser from "./addUser";
import makeEditUser from "./editUser";
import { moderateName } from "../../../Utilities/moderateText";
import usersDb from "../data-access";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addUser = makeAddUser({ usersDb, handleModeration });
const editUser = makeEditUser({ usersDb, handleModeration });
const userService = Object.freeze({
    addUser,
    editUser,
});

export default userService;

export { addUser, editUser };
