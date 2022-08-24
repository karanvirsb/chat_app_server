import { IUserDb } from ".";
import { IUser } from "../user";

type props = {
    makeDb: IUserDb["makeDb"];
};

export default function makeUsersDb({ makeDb }: props) {
    return Object.freeze({
        findById,
        findByUsername,
        findByEmail,
        update,
        remove,
        insert,
    });

    async function findById({
        id,
    }: {
        id: string;
    }): Promise<IUser | undefined> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM userT WHERE userId = '${id}'`;
            const res = await db.query(query);
            return res.rows[0];
        } catch (error) {
            console.log(error);
        } finally {
            db.release();
        }
    }
    async function findByUsername() {}
    async function update() {}
    async function remove() {}
    async function insert({
        data,
    }: {
        data: IUser;
    }): Promise<IUser | undefined> {
        const db = await makeDb();
        try {
            const query =
                "INSERT INTO userT VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
            // TODO find by username
            const res = await db.query(query, [
                data.userId,
                data.username,
                data.email,
                data.password,
                data.status,
                data.refreshToken,
            ]);
            const user: IUser = res.rows[0];
            return user;
        } catch (err) {
            console.log(err);
            db.release();
        } finally {
            db.release();
        }
    }
    async function findByEmail() {}
}
