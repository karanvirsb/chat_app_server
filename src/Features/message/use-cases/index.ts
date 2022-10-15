import makeCreateMessage from "./createMessage";
import messageDb from "../data-access";
import makeDeleteMessage from "./deleteMessage";

const createMessage = makeCreateMessage({ messageDb });
const deleteMessage = makeDeleteMessage({ messageDb });

const messageService = Object.freeze({
    createMessage,
    deleteMessage,
});

export default messageService;

export { createMessage, deleteMessage };
