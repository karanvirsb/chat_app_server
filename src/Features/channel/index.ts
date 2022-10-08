import sanitizeHtml from "sanitize-html";
import buildChannel from "./channel";
import Id from "../../Utilities/id";

export default buildChannel({ Id, sanitizeText });

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}
