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

export default function makeGetUser({ usersDb }: props) {
    return async function getUser(username: string): returnData {
        if (!username) {
            throw new Error("Username must be passed through");
        }
        return await usersDb.findByUsername(username);
    };
}
