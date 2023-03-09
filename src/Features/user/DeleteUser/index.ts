import makeDeleteUser from "../DeleteUser/deleteUserUseCase";
import usersDb from "../data-access";

export const deleteUser = makeDeleteUser({ usersDb });
