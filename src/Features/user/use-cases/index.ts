import makeAddUser from "./addUser";
import makeEditUser from "./editUser";
import { moderateName } from "../../../Utilities/moderateText";
import usersDb from "../data-access";
import makeDeleteUser from "./deleteUser";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addUser = makeAddUser({ usersDb, handleModeration });
const editUser = makeEditUser({ usersDb, handleModeration });
const deleteUser = makeDeleteUser({ usersDb });

const userService = Object.freeze({
    addUser,
    editUser,
    deleteUser,
});

export default userService;

export { addUser, editUser, deleteUser };
