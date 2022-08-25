import usersDb, { IUserDb } from ".";
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
        findByEmail: (email: string) => returningData["type"];
        update: ({
            userId,
            updates,
        }: {
            userId: string;
            updates: Record<keyof IUser, string>;
        }) => returningData["type"];
        remove: (userId: string) => returningData["type"];
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
    async function update({
        userId,
        updates,
    }: {
        userId: string;
        updates: Record<keyof IUser, string>;
    }): returningData["type"] {
        const db = await makeDb();
        try {
            const updateStringBuilder = (updates: {
                [key: string]: string;
            }) => {
                const concatString = [];
                for (const update in updates) {
                    if (updates[update]) {
                        concatString.push(`${update} = '${updates[update]}'`);
                    }
                }

                return concatString.join(", ");
            };
            const updateString = updateStringBuilder(updates);
            const query = `UPDATE userT SET ${updateString.trim()} WHERE userId = '${userId}' RETURNING *`;
            const res = await db.query(query.trim());
            return { success: true, data: res.rows[0], error: "" };
        } catch (error: any) {
            console.log(error);
            return { success: true, data: undefined, error: error };
        } finally {
            db.release();
        }
    }

    async function remove(userId: string): returningData["type"] {
        const db = await makeDb();
        try {
            const query = `DELETE FROM userT WHERE userId = '${userId}' RETURNING *`;
            const res = await db.query(query);
            return { success: true, data: res.rows[0], error: "" };
        } catch (err: any) {
            console.log(err);
            db.release();
            return { success: true, data: undefined, error: err };
        } finally {
            db.release();
        }
    }
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
    async function findByEmail(email: string): returningData["type"] {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM userT WHERE email = '${email}'`;
            const res = await db.query(query);
            return { success: true, data: res.rows[0], error: "" };
        } catch (err: any) {
            return { success: true, data: undefined, error: err };
        } finally {
            db.release();
        }
    }
}
