import { getUser, addUser, deleteUser } from "../use-cases";
import makeDeleteUser from "./delete-user";
import makeGetUser from "./get-user";
import makePostUser from "./post-user";

const getAnUser = makeGetUser({ getUser });
const addAnUser = makePostUser({ addUser });
const deleteAnUser = makeDeleteUser({ deleteUser });

const commentController = Object.freeze({
    getAnUser,
    addAnUser,
    deleteAnUser,
});
export default commentController;

export { getAnUser, addAnUser, deleteAnUser };
