import makePostUser from "../AddUser/post-user";
import makeAddUser from "../AddUser/addUser";
import { moderateName } from "../../../Utilities/moderateText";
import usersDb from "../data-access";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

export const addUserUC = makeAddUser({ usersDb, handleModeration });
export const addUserController = makePostUser({ addUser: addUserUC });

export type handleModerationType = (name: string) => Promise<number | boolean>;
