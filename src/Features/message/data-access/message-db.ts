import { IMessageDb } from ".";

type props = {
    makeDb: IMessageDb["makeDb"];
};

export interface IMakeMessageDb {
    returnType: Readonly<{}>;
}

export default function makeMessageDb({
    makeDb,
}: props): IMakeMessageDb["returnType"] {
    return Object.freeze({});
}
