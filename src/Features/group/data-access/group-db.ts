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
        findById: (id: string) => returningData;
        createGroup: (groupInfo: IGroup, userId: string) => returningData;
    }>;
}

export default function makeGroupDb({
    makeDb,
}: props): IMakeGroupDb["returnType"] {
    return Object.freeze({
        findById,
        createGroup,
    });

    // Find group by id
    async function findById(id: string): returningData {
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
    ): returningData {
        const db = await makeDb();
        try {
            const query = `INSERT INTO groupt VALUES ($1, $2, $3, $4) RETURNING *;`;
            const result = await db.query(query, [
                groupInfo.groupId,
                groupInfo.groupName,
                groupInfo.inviteCode,
                groupInfo.channels,
            ]);

            const q = `INSERT INTO "groupUsers" values('${groupInfo.groupId}', '${userId}', [2000])`;
            const res = await db.query(q);

            if (result.rows.length > 1 && res.rows.length >= 1) {
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
    // Regenerate invite code
    // delete group
    // add channel
    // remove channel
    // Add user to group
}
