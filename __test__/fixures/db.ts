import { Pool } from "pg";

const pool = new Pool({ database: process.env.TEST_DATABASE });

export default async function makeDb() {
    await pool.connect();
    return pool;
}

export async function closeDb() {
    await pool.end();
}

export async function clearDb() {
    return (await (await pool.query("DELETE FROM userT")).rowCount) > 0;
}

export { pool };
