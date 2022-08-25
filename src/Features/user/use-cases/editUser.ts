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

type editUserProps = {
    userId: string;
    updates: Record<keyof IUser, string>;
};

export default function makeEditUser({ usersDb, handleModeration }: props) {
    return async function editUser({
        userId,
        updates,
    }: editUserProps): returnData {
        const foundUser = await usersDb.findById({ id: userId });

        if (foundUser.success && foundUser.data === undefined) {
            return foundUser;
        }

        let moderated: number | boolean | null = null;

        if (updates.username) {
            moderated = await handleModeration(updates["username"]);
        }
        if (updates.email) {
            moderated = await handleModeration(updates["email"]);
        }
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

        return await usersDb.update({ userId, updates });
    };
}
