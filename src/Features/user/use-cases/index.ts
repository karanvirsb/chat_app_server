import makeEditUser from "./editUser";
import makeDeleteUser from "../DeleteUser/deleteUserUseCase";
import makeGetUser from "./getUser";
import { moderateName } from "../../../Utilities/moderateText";
import usersDb from "../data-access";
import makeEditUserByUsername from "./editUserByUsername";

export type handleModerationType = (name: string) => Promise<number | boolean>;

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

const editUser = makeEditUser({ usersDb, handleModeration });
const deleteUser = makeDeleteUser({ usersDb });
const getUser = makeGetUser({ usersDb });
const editUserByUsername = makeEditUserByUsername({ usersDb });

const userService = Object.freeze({
  editUser,
  deleteUser,
  getUser,
  editUserByUsername,
});

export default userService;

export { editUser, deleteUser, getUser, editUserByUsername };
