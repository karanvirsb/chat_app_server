import { getUser, deleteUser, editUser } from "../use-cases";
import makeDeleteUser from "../DeleteUser/deleteUserController";
import makeEditUser from "./edit-user";
import makeGetUser from "./get-user";
import makePostUser from "../AddUser/addUserController";

const getAnUser = makeGetUser({ getUser });
const deleteAnUser = makeDeleteUser({ deleteUser });
const editAnUser = makeEditUser({ editUser });

const userController = Object.freeze({
  getAnUser,
  deleteAnUser,
  editAnUser,
});
export default userController;

export { getAnUser, deleteAnUser, editAnUser };
