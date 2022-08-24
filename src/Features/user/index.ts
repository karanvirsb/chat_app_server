import Id from "../../Utilities/id";
import buildUser from "./user";
import sanitizeHtml from "sanitize-html";

export default buildUser({ Id, sanitizeText });

function sanitizeText(text: string) {
    return sanitizeHtml(text);
}
