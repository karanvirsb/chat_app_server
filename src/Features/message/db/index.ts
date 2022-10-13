import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupMessageDb() {
    console.log("setting up message database...");
    // database will be created if it doesnt exist already

    const db = await makeDb();
    const result = await db.query(
        `CREATE TABLE IF NOT EXISTS messaget (
          "messageId" VARCHAR(100) PRIMARY KEY, 
          "dateCreated" timestamp, 
          "dateModified" timestamp, 
          "replyTo" VARCHAR(100) references messaget("messageId"), 
          text VARCHAR(200), 
          "userId" VARCHAR(100) REFERENCES usert("userId"), 
          "channelId" VARCHAR(100) REFERENCES channelt("channelId")
        );`
    );
    console.log(
        "🚀 ~ file: index.ts ~ line 20 ~ setupMessageDb ~ result",
        result
    );

    console.log("Message Database set up complete...");
}
