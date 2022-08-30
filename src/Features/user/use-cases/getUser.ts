import { IUser } from "../user";
import { IMakeUsersDb } from "../data-access/users-db";

type props = {
    usersDb: IMakeUsersDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IUser | undefined;
    error: string;
}>;

export interface IGetUserUseCase {
    getUser: (userId: string) => returnData;
}

export default function makeGetUser({ usersDb }: props) {
    return async function getUser(userId: string): returnData {
        if (!userId) {
            throw new Error("UserId must be passed through");
        }
        return await usersDb.findById({ id: userId });
    };
}
