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
import privateChannelControllers from "./src/Features/privateChannel/controllers";
import privateMessagesController from "./src/Features/privateMessage/controllers";
import friendsControllers from "./src/Features/friends/controllers";
import { deleteGroupUserController } from "./src/Features/groupUsers/slice";
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
app.get(`/user/:id`, makeExpressCallback(getAnUser));
app.delete(`/user/delete`, makeExpressCallback(deleteAnUser));
app.put(`/user/update`, makeExpressCallback(editAnUser));

// group routes
app.post(`/group`, makeExpressCallback(groupControllers.addGroupController));
app.post(
  `/group/user`,
  makeExpressCallback(groupControllers.addUserToGroupController)
);
app.delete(
  `/group`,
  makeExpressCallback(groupControllers.deleteGroupController)
);
app.delete(
  `/group/user`,
  makeExpressCallback(groupControllers.deleteUserFromGroupController)
);
app.get(
  `/group/:groupId`,
  makeExpressCallback(groupControllers.getGroupByIdController)
);
app.get(
  `/group/invite/:inviteCode`,
  makeExpressCallback(groupControllers.getGroupByInviteCodeController)
);
app.get(
  `/group/users/:groupId`,
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

// GROUP USER ROUTES
app.delete("/group-users", makeExpressCallback(deleteGroupUserController));

// channel routes
app.get(
  `/groupChannel/:channelId`,
  makeExpressCallback(channelControllers.getChannelByIdController)
);
app.get(
  `/groupChannel/all/:groupId`,
  makeExpressCallback(channelControllers.getChannelsByGroupIdController)
);
app.post(
  `/groupChannel`,
  makeExpressCallback(channelControllers.createChannelController)
);
app.delete(
  `/groupChannel`,
  makeExpressCallback(channelControllers.deleteChannelController)
);
app.put(
  `/groupChannel/name`,
  makeExpressCallback(channelControllers.updateChannelNameController)
);

// message routes

app.get(
  `/groupMessage/:messageId`,
  makeExpressCallback(messagesController.getMessageByIdController)
);
app.get(
  `/groupMessage/channel/messages`,
  makeExpressCallback(messagesController.getMessagesByChannelIdController)
);
app.post(
  `/groupMessage`,
  makeExpressCallback(messagesController.createMessageController)
);
app.delete(
  `/groupMessage`,
  makeExpressCallback(messagesController.deleteMessageController)
);
app.put(
  `/groupMessage/dateModified`,
  makeExpressCallback(messagesController.updateDateModifiedController)
);
app.put(
  `/groupMessage/text`,
  makeExpressCallback(messagesController.updateMessageTextController)
);

// Friends

app.post(
  "/friends/add",
  makeExpressCallback(friendsControllers.addFriendController)
);
app.delete(
  "/friends/delete",
  makeExpressCallback(friendsControllers.deleteFriendController)
);
app.get(
  "/friends/:userId&:friendId",
  makeExpressCallback(friendsControllers.getAFriendController)
);
app.get(
  "/friends/:userId",
  makeExpressCallback(friendsControllers.getFriendsController)
);

// privateChannel

app.get(
  `/privateChannel/:channelId`,
  makeExpressCallback(privateChannelControllers.getPrivateChannelByIdController)
);
app.get(
  `/privateChannel/user/:userId`,
  makeExpressCallback(
    privateChannelControllers.getPrivateChannelsByUserIdController
  )
);
app.post(
  `/privateChannel`,
  makeExpressCallback(privateChannelControllers.createPrivateChannelController)
);
app.delete(
  `/privateChannel`,
  makeExpressCallback(privateChannelControllers.deletePrivateChannelController)
);
app.put(
  `/privateChannel/lastActive`,
  makeExpressCallback(privateChannelControllers.updateLastActiveController)
);
// privateMessage
app.get(
  `/privateMessage/:messageId`,
  makeExpressCallback(privateMessagesController.getPrivateMessageByIdController)
);
app.get(
  `/privateMessage/channel`,
  makeExpressCallback(
    privateMessagesController.getPrivateMessagesByChannelIdController
  )
);
app.post(
  `/privateMessage`,
  makeExpressCallback(privateMessagesController.createPrivateMessageController)
);
app.delete(
  `/privateMessage`,
  makeExpressCallback(privateMessagesController.deletePrivateMessageController)
);
app.put(
  `/privateMessage/dateModified`,
  makeExpressCallback(privateMessagesController.updateDateModifiedController)
);
app.put(
  `/privateMessage/text`,
  makeExpressCallback(
    privateMessagesController.updatePrivateMessageTextController
  )
);

export default app;
