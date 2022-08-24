import { nanoid } from "nanoid";

export interface IId {
    makeId: () => string;
}

export default {
    makeId: () => nanoid(),
};
