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
    }>;
}

export default function makeGroupDb({
    makeDb,
}: props): IMakeGroupDb["returnType"] {
    return Object.freeze({
        findById,
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
        }
    }
    // Edit group name
    // Regenerate invite code
    // delete group
    // create group
    // add channel
    // remove channel
    // Add user to group
}
