import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupChannelDb() {
    console.log("setting up group database...");
    // database will be created if it doesnt exist already

    const db = await makeDb();
    const result = await db.query(
        `CREATE TABLE channelt (
          channelId VARCHAR(100) PRIMARY KEY,
          "channelName" VARCHAR(50),
          "dateCreated" VARCHAR(100),
          "groupId" VARCHAR(100) REFERENCES groupt("groupId")
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );`
    );
    console.log(
        "🚀 ~ file: index.ts ~ line 20 ~ setupChannelDb ~ result",
        result
    );

    console.log("Channel Database set up complete...");
}
