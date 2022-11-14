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

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "http://google.com", "*"],
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })
);

app.use(middleware());
app.use(bodyParser.json());
// routes
app.get(`/ping`, (req, res) => {
    console.log(req);
    res.status(200).json({ message: "echo" });
});

// user routes
app.get(`/user`, makeExpressCallback(getAnUser));
app.delete(`/user/delete`, makeExpressCallback(deleteAnUser));
app.put(`/user/update`, makeExpressCallback(editAnUser));

// group routes
app.post(`group/add`, makeExpressCallback(groupControllers.addGroupController));
app.post(
    `/group/addUser`,
    makeExpressCallback(groupControllers.addUserToGroupController)
);
app.delete(
    `group/delete`,
    makeExpressCallback(groupControllers.deleteGroupController)
);
app.delete(
    `/group/deleteUser`,
    makeExpressCallback(groupControllers.deleteUserFromGroupController)
);
app.get(
    `/group/id`,
    makeExpressCallback(groupControllers.getGroupByIdController)
);
app.get(
    `/group/invite`,
    makeExpressCallback(groupControllers.getGroupByInviteCodeController)
);
app.get(
    `/group/getUsers`,
    makeExpressCallback(groupControllers.getUsersByGroupIdController)
);
app.get(
    `/group/userId/:userId`,
    makeExpressCallback(groupControllers.getGroupsByUserIdController)
);
app.put(
    `/group/name`,
    makeExpressCallback(groupControllers.updateGroupNameController)
);
app.put(
    `/group/invite`,
    makeExpressCallback(groupControllers.updateInviteCodeController)
);

// channel routes
app.get(
    `/channel`,
    makeExpressCallback(channelControllers.getChannelByIdController)
);
app.get(
    `/channels`,
    makeExpressCallback(channelControllers.getChannelsByGroupIdController)
);
app.post(
    `/channel`,
    makeExpressCallback(channelControllers.createChannelController)
);
app.delete(
    `/channel`,
    makeExpressCallback(channelControllers.deleteChannelController)
);
app.put(
    `/channel/name`,
    makeExpressCallback(channelControllers.updateChannelNameController)
);

// message routes

app.get(
    `/message`,
    makeExpressCallback(messagesController.getMessageByIdController)
);
app.get(
    `/message/channel`,
    makeExpressCallback(messagesController.getMessagesByChannelIdController)
);
app.post(
    `/message`,
    makeExpressCallback(messagesController.createMessageController)
);
app.delete(
    `/message`,
    makeExpressCallback(messagesController.deleteMessageController)
);
app.put(
    `/message/dateModified`,
    makeExpressCallback(messagesController.updateDateModifiedController)
);
app.put(
    `/message/text`,
    makeExpressCallback(messagesController.updateMessageTextController)
);

export default app;
