import makeAddUser from "./addUser";
import makeEditUser from "./editUser";
import makeDeleteUser from "./deleteUser";
import makeGetUser from "./getUser";
import { moderateName } from "../../../Utilities/moderateText";
import usersDb from "../data-access";
import makeEditUserByUsername from "./editUserByUser";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
    return await moderateName(name);
};

const addUser = makeAddUser({ usersDb, handleModeration });
const editUser = makeEditUser({ usersDb, handleModeration });
const deleteUser = makeDeleteUser({ usersDb });
const getUser = makeGetUser({ usersDb });
const editUserByUsername = makeEditUserByUsername({ usersDb });

const userService = Object.freeze({
    addUser,
    editUser,
    deleteUser,
    getUser,
    editUserByUsername,
});

export default userService;

export { addUser, editUser, deleteUser, getUser, editUserByUsername };
