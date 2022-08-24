import { IUserDb } from ".";
import { IUser } from "../user";

type props = {
    makeDb: IUserDb["makeDb"];
};

type returningData = {
    type: Promise<{
        success: boolean;
        data: IUser | undefined;
        error: string;
    }>;
};

export interface IMakeUsersDb {
    returnType: Readonly<{
        findById: ({ id }: { id: string }) => returningData["type"];
        findByUsername: (username: string) => returningData["type"];
        findByEmail: () => Promise<void>;
        update: () => Promise<void>;
        remove: () => Promise<void>;
        insert: ({ data }: { data: IUser }) => returningData["type"];
    }>;
}

export default function makeUsersDb({ makeDb }: props) {
    return Object.freeze({
        findById,
        findByUsername,
        findByEmail,
        update,
        remove,
        insert,
    });

    async function findById({ id }: { id: string }): returningData["type"] {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM userT WHERE userId = '${id}'`;
            const res = await db.query(query);
            return { success: true, data: await res.rows[0], error: "" };
        } catch (error: any) {
            console.log(error);
            return { success: true, data: undefined, error: error };
        } finally {
            db.release();
        }
    }
    async function findByUsername(username: string): returningData["type"] {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM userT WHERE username = '${username}'`;
            const res = await db.query(query);
            return { success: true, data: res.rows[0], error: "" };
        } catch (err: any) {
            return { success: true, data: undefined, error: err };
        } finally {
            db.release();
        }
    }
    async function update() {}
    async function remove() {}
    async function insert({ data }: { data: IUser }): returningData["type"] {
        const db = await makeDb();
        try {
            const query =
                "INSERT INTO userT VALUES($1, $2, $3, $4, $5, $6) RETURNING *";

            const foundUser = await findByUsername(data.username);
            if (foundUser.data !== undefined) {
                return {
                    success: true,
                    data: undefined,
                    error: "User already exists",
                };
            }
            const res = await db.query(query, [
                data.userId,
                data.username,
                data.email,
                data.password,
                data.status,
                data.refreshToken,
            ]);
            const user: IUser = res.rows[0];
            return { success: true, data: user, error: "" };
        } catch (err: any) {
            console.log(err);
            db.release();
            return { success: true, data: undefined, error: err };
        } finally {
            db.release();
        }
    }
    async function findByEmail() {}
}
