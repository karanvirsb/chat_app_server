import buildMessage from "./message";
import Id from "../../Utilities/id";
import sanitize from "sanitize-html";

export default buildMessage({ Id, sanitizeText });

function sanitizeText(text: string) {
    return sanitize(text);
}
