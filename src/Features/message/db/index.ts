import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupMessageDb() {
    console.log("setting up message database...");
    // database will be created if it doesnt exist already

    const db = await makeDb();
    const result = await db.query(
        `CREATE TABLE IF NOT EXISTS messaget (
          
        );`
    );
    console.log(
        "🚀 ~ file: index.ts ~ line 20 ~ setupMessageDb ~ result",
        result
    );

    console.log("Message Database set up complete...");
}
