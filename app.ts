import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { middleware } from "supertokens-node/framework/express";
import supertokens from "./supertokens";
import {
    deleteAnUser,
    editAnUser,
    getAnUser,
} from "./src/Features/user/controllers";
const appRoot = process.env.API_DOMAIN;

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

// user routes
app.get(`${appRoot}/user`, getAnUser);
app.delete(`${appRoot}/user/delete`, deleteAnUser);
app.put(`${appRoot}/user/update`, editAnUser);

export default app;
