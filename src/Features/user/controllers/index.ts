import { getUser, addUser, deleteUser } from "../use-cases";
import makeDeleteUser from "./delete-user";
import makeGetUser from "./get-user";
import makePostUser from "./post-user";

const getAnUser = makeGetUser({ getUser });
const addAnUser = makePostUser({ addUser });
const deleteAnUser = makeDeleteUser({ deleteUser });

const userController = Object.freeze({
    getAnUser,
    addAnUser,
    deleteAnUser,
});
export default userController;

export { getAnUser, addAnUser, deleteAnUser };
