import { getUser, addUser, deleteUser, editUser } from "../use-cases";
import makeDeleteUser from "./delete-user";
import makeEditUser from "./edit-user";
import makeGetUser from "./get-user";
import makePostUser from "../AddUser/addUserController";

const getAnUser = makeGetUser({ getUser });
const addAnUser = makePostUser({ addUser });
const deleteAnUser = makeDeleteUser({ deleteUser });
const editAnUser = makeEditUser({ editUser });

const userController = Object.freeze({
  getAnUser,
  addAnUser,
  deleteAnUser,
  editAnUser,
});
export default userController;

export { getAnUser, addAnUser, deleteAnUser, editAnUser };
