import makeCreateMessage from "./createMessage";
import messageDb from "../data-access";
import makeDeleteMessage from "./deleteMessage";
import makeGetMessageById from "./getMessageById";

const createMessage = makeCreateMessage({ messageDb });
const deleteMessage = makeDeleteMessage({ messageDb });
const getMessageById = makeGetMessageById({ messageDb });

const messageService = Object.freeze({
    createMessage,
    deleteMessage,
    getMessageById,
});

export default messageService;

export { createMessage, deleteMessage, getMessageById };
