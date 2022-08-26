import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { middleware } from "supertokens-node/framework/express";

import userService from "./src/Features/user/use-cases";
import supertokens from "./supertokens";
dotenv.config();

let app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })
);

app.use(middleware());
app.use(bodyParser.json());
// routes

export default app;
