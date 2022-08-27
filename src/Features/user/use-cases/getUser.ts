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
    getUser: (email: string) => returnData;
}

export default function makeGetUser({ usersDb }: props) {
    return async function getUser(email: string): returnData {
        if (!email) {
            throw new Error("Email must be passed through");
        }
        return await usersDb.findByEmail(email);
    };
}
