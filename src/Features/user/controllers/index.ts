import { getUser, addUser } from "../use-cases";
import makeGetUser from "./get-user";
import makePostUser from "./post-user";

const getAnUser = makeGetUser({ getUser });
const addAnUser = makePostUser({ addUser });

const commentController = Object.freeze({
    getAnUser,
    addAnUser,
});
export default commentController;

export { getAnUser, addAnUser };
