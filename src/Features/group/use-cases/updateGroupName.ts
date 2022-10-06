import { handleModerationType } from ".";
import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
    handleModeration: handleModerationType;
    sanitizeName: (text: string) => string;
};

type returnData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;

export interface IUpdateGroupName {
    updateGroupName: (
        groupId: string,
        newGroupName: string
    ) => Promise<returnData>;
}

export default function makeUpdateGroupName({
    groupDb,
    handleModeration,
    sanitizeName,
}: props) {
    return async function updateGroupName(
        groupId: string,
        newGroupName: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group id needs to be supplied");
        if (!newGroupName) throw new Error("A new group name must be supplied");

        const sanitizedGroupName = sanitizeName(newGroupName);

        if (sanitizedGroupName.length <= 1) {
            throw new Error("Group name must contain valid characters");
        }

        if (sanitizedGroupName.length < 3 || sanitizedGroupName.length > 50) {
            throw new Error(
                "Group name must be between 3 and 50 characters long"
            );
        }

        const moderatedName = await handleModeration(sanitizedGroupName);

        if (moderatedName) {
            return {
                success: false,
                data: undefined,
                error: "Group name contains profanity",
            };
        }

        if (moderatedName === -1) {
            return {
                success: false,
                data: undefined,
                error: "Server Error, please try again.",
            };
        }

        return await groupDb.updateGroupName(groupId, sanitizedGroupName);
    };
}
