import { IFriendsDb } from ".";

type props = {
    makeDb: IFriendsDb["makeDb"];
};

export interface IMakeFriendsDb {
    returnType: Readonly<{}>;
}

export default function makeFriendsDb({
    makeDb,
}: props): IMakeFriendsDb["returnType"] {
    return Object.freeze({});
}
