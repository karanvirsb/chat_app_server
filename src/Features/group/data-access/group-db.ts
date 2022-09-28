import { IGroupDb } from ".";
import { IGroup } from "../group";

type props = {
    makeDb: IGroupDb["makeDb"];
};

type returningData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;
export interface IMakeGroupDb {
    returnType: Readonly<{
        findById: (id: string) => Promise<returningData>;
        createGroup: (
            groupInfo: IGroup,
            userId: string
        ) => Promise<returningData>;
        updateGroupName: (
            groupId: string,
            groupName: string
        ) => Promise<returningData>;
        removeGroup: (groupId: string) => Promise<returningData>;
        regenerateInviteCode: (
            groupId: string,
            newCode: string
        ) => Promise<returningData>;
        findByInviteCode: (inviteCode: string) => Promise<returningData>;
    }>;
}

export default function makeGroupDb({
    makeDb,
}: props): IMakeGroupDb["returnType"] {
    return Object.freeze({
        findById,
        createGroup,
        updateGroupName,
        removeGroup,
        regenerateInviteCode,
        findByInviteCode,
    });

    // Find group by id
    async function findById(id: string): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM groupt WHERE "groupId" = '${id}'`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                return { success: true, data: res.rows[0], error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find any user with that id",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 35 ~ findById ~ error",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
    // create group
    async function createGroup(
        groupInfo: IGroup,
        userId: string
    ): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO groupt VALUES ($1, $2, $3, $4) RETURNING *;`;
            const result = await db.query(query, [
                groupInfo.groupId,
                groupInfo.groupName,
                groupInfo.inviteCode,
                groupInfo.channels,
            ]);

            const q = `INSERT INTO "groupUsers" values('${groupInfo.groupId}', '${userId}', '{2000}') RETURNING *;`;
            const res = await db.query(q);

            if (result.rows.length >= 1 && res.rows.length >= 1) {
                const group = result.rows[0];
                return { success: true, data: group, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not insert group",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 75 ~ createGroup ~ error",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
    // Edit group name

    async function updateGroupName(
        groupId: string,
        groupName: string
    ): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `UPDATE groupt SET "groupName" = '${groupName}' WHERE "groupId" = '${groupId}' RETURNING *`;
            const res = await db.query(query);
            if (res.rows.length > 0) {
                const updatedGroup: IGroup = res.rows[0];
                return { success: true, data: updatedGroup, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not update group name",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 107 ~ updateGroupName ~ error",
                error
            );
            return { success: false, data: undefined, error: error + "" };
        } finally {
            db.release();
        }
    }

    // delete group

    async function removeGroup(groupId: string): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM groupt WHERE "groupId" = '${groupId}' RETURNING *`;
            const res = await db.query(query);
            if (res.rows.length > 0) {
                const deletedGroup: IGroup = res.rows[0];
                return { success: true, data: deletedGroup, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not update group name",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 146 ~ removeGroup ~ error",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    // Regenerate invite code

    async function regenerateInviteCode(
        groupId: string,
        newCode: string
    ): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `UPDATE groupt SET "inviteCode" = '${newCode}' WHERE "groupId" = '${groupId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rows.length >= 1) {
                const group: IGroup = res.rows[0];
                return { success: true, data: group, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not regenerate invite code",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 179 ~ regenerateInviteCode ~ error",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    // find group based on invite code
    async function findByInviteCode(
        inviteCode: string
    ): Promise<returningData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM groupt WHERE "inviteCode" = '${inviteCode}'`;
            const res = await db.query(query);
            if (res.rows.length >= 1) {
                const group: IGroup = res.rows[0];
                return {
                    success: true,
                    data: group,
                    error: "",
                };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find group with that invite code",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: group-db.ts ~ line 219 ~ findByInviteCode ~ error",
                error
            );
            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
    // add channel

    // remove channel
    // Add user to group
    // remove user from group
}
