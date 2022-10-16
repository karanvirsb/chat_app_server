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
import channelControllers from "./src/Features/channel/controllers";
import messagesController from "./src/Features/message/controllers";
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
    res.status(200).json({ message: "echo" });
});

// user routes
app.get(`${appRoot}/user`, getAnUser);
app.delete(`${appRoot}/user/delete`, deleteAnUser);
app.put(`${appRoot}/user/update`, editAnUser);

// group routes
app.post(`${appRoot}/addGroup`, groupControllers.addGroupController);
app.post(`${appRoot}/group/addUser`, groupControllers.addUserToGroupController);
app.delete(`${appRoot}/deleteGroup`, groupControllers.deleteGroupController);
app.delete(
    `${appRoot}/group/deleteUser`,
    groupControllers.deleteUserFromGroupController
);
app.get(`${appRoot}/group/id`, groupControllers.getGroupByIdController);
app.get(
    `${appRoot}/group/invite`,
    groupControllers.getGroupByInviteCodeController
);
app.get(
    `${appRoot}/group/getUsers`,
    groupControllers.getUsersByGroupIdController
);
app.get(
    `${appRoot}/group/userId`,
    groupControllers.getGroupsByUserIdController
);
app.put(`${appRoot}/group/name`, groupControllers.updateGroupNameController);
app.put(`${appRoot}/group/invite`, groupControllers.updateInviteCodeController);

// channel routes
app.get(`${appRoot}/channel`, channelControllers.getChannelByIdController);
app.get(
    `${appRoot}/channels`,
    channelControllers.getChannelsByGroupIdController
);
app.post(`${appRoot}/channel`, channelControllers.createChannelController);
app.delete(`${appRoot}/channel`, channelControllers.deleteChannelController);
app.put(
    `${appRoot}/channel/name`,
    channelControllers.updateChannelNameController
);

// message routes

app.get(`${appRoot}/message`, messagesController.getMessageByIdController);
app.get(
    `${appRoot}/message/channel`,
    messagesController.getMessagesByChannelIdController
);
app.post(`${appRoot}/message`, messagesController.createMessageController);
app.delete(`${appRoot}/message`, messagesController.deleteMessageController);
app.put(
    `${appRoot}/message/dateModified`,
    messagesController.updateDateModifiedController
);
app.put(
    `${appRoot}/message/text`,
    messagesController.updateMessageTextController
);

export default app;
