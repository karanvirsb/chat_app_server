import makeCreateMessage from "./createMessage";
import messageDb from "../data-access";

const createMessage = makeCreateMessage({ messageDb });

const messageService = Object.freeze({
    createMessage,
});

export default messageService;

export { createMessage };
