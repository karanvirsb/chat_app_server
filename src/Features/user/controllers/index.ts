import { getUser } from "../use-cases";
import makeGetUser from "./get-user";

const getAnUser = makeGetUser({ getUser });

const commentController = Object.freeze({
    getAnUser,
});
export default commentController;

export { getAnUser };
