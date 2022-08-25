import makeUser from "../index";
import { IUser } from "../user";
import { IMakeUsersDb } from "../data-access/users-db";
import { handleModerationType } from ".";

type props = {
    usersDb: IMakeUsersDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IUser | undefined;
    error: string;
}>;

export default function makeAddUser({ usersDb, handleModeration }: props) {
    return async function addUser(userInfo: IUser): returnData {
        const user = makeUser({ ...userInfo });
        const exists = await usersDb.findByUsername(user.getUsername());

        if (exists.success && exists.data !== undefined) {
            return {
                success: true,
                data: undefined,
                error: "User already exists",
            };
        }

        const moderated = await handleModeration(user.getUsername());

        if (moderated) {
            return {
                success: false,
                data: undefined,
                error: "Username contains profanity",
            };
        }

        if (moderated === -1) {
            return {
                success: false,
                data: undefined,
                error: "Server Error, please try again.",
            };
        }

        return await usersDb.insert({
            data: {
                email: user.getEmail(),
                password: user.getPassword(),
                refreshToken: user.getRefreshToken(),
                status: user.getStatus(),
                userId: user.getUserId(),
                username: user.getUsername(),
            },
        });
    };
}
