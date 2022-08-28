import cuid from "cuid";

export interface IId {
    makeId: () => string;
}

export default {
    makeId: () => cuid(),
};
