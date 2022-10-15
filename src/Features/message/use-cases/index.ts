import makeCreateMessage from "./createMessage";
import messageDb from "../data-access";
import makeDeleteMessage from "./deleteMessage";
import makeGetMessageById from "./getMessageById";
import makegetMessagesByChannelId from "./getMessagesByChannelId";

const createMessage = makeCreateMessage({ messageDb });
const deleteMessage = makeDeleteMessage({ messageDb });
const getMessageById = makeGetMessageById({ messageDb });
const getMessagesByChannelId = makegetMessagesByChannelId({ messageDb });

const messageService = Object.freeze({
    createMessage,
    deleteMessage,
    getMessageById,
    getMessagesByChannelId,
});

export default messageService;

export { createMessage, deleteMessage, getMessageById, getMessagesByChannelId };
