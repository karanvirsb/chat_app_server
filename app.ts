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
import groupControllers from "./src/Features/group/controllers";
import channelControllers from "./src/Features/groupChannel/controllers";
import messagesController from "./src/Features/groupMessage/controllers";
import makeExpressCallback from "./src/express-callback";
const appRoot = process.env.API_DOMAIN;

let app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "http://google.com"],
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })
);

app.use(middleware());
app.use(bodyParser.json());
// routes
app.get(`${appRoot}/ping`, (req, res) => {
    console.log(req);
    res.status(200).json({ message: "echo" });
});

// user routes
app.get(`${appRoot}/user`, makeExpressCallback(getAnUser));
app.delete(`${appRoot}/user/delete`, makeExpressCallback(deleteAnUser));
app.put(`${appRoot}/user/update`, makeExpressCallback(editAnUser));

// group routes
app.post(
    `${appRoot}group/add`,
    makeExpressCallback(groupControllers.addGroupController)
);
app.post(
    `${appRoot}/group/addUser`,
    makeExpressCallback(groupControllers.addUserToGroupController)
);
app.delete(
    `${appRoot}group/delete`,
    makeExpressCallback(groupControllers.deleteGroupController)
);
app.delete(
    `${appRoot}/group/deleteUser`,
    makeExpressCallback(groupControllers.deleteUserFromGroupController)
);
app.get(
    `${appRoot}/group/id`,
    makeExpressCallback(groupControllers.getGroupByIdController)
);
app.get(
    `${appRoot}/group/invite`,
    makeExpressCallback(groupControllers.getGroupByInviteCodeController)
);
app.get(
    `${appRoot}/group/getUsers`,
    makeExpressCallback(groupControllers.getUsersByGroupIdController)
);
app.get(
    `${appRoot}/group/userId/:userId`,
    makeExpressCallback(groupControllers.getGroupsByUserIdController)
);
app.put(
    `${appRoot}/group/name`,
    makeExpressCallback(groupControllers.updateGroupNameController)
);
app.put(
    `${appRoot}/group/invite`,
    makeExpressCallback(groupControllers.updateInviteCodeController)
);

// channel routes
app.get(
    `${appRoot}/channel`,
    makeExpressCallback(channelControllers.getChannelByIdController)
);
app.get(
    `${appRoot}/channels`,
    makeExpressCallback(channelControllers.getChannelsByGroupIdController)
);
app.post(
    `${appRoot}/channel`,
    makeExpressCallback(channelControllers.createChannelController)
);
app.delete(
    `${appRoot}/channel`,
    makeExpressCallback(channelControllers.deleteChannelController)
);
app.put(
    `${appRoot}/channel/name`,
    makeExpressCallback(channelControllers.updateChannelNameController)
);

// message routes

app.get(
    `${appRoot}/message`,
    makeExpressCallback(messagesController.getMessageByIdController)
);
app.get(
    `${appRoot}/message/channel`,
    makeExpressCallback(messagesController.getMessagesByChannelIdController)
);
app.post(
    `${appRoot}/message`,
    makeExpressCallback(messagesController.createMessageController)
);
app.delete(
    `${appRoot}/message`,
    makeExpressCallback(messagesController.deleteMessageController)
);
app.put(
    `${appRoot}/message/dateModified`,
    makeExpressCallback(messagesController.updateDateModifiedController)
);
app.put(
    `${appRoot}/message/text`,
    makeExpressCallback(messagesController.updateMessageTextController)
);

export default app;
