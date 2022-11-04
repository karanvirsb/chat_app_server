import { IMakeFriendsDb } from "../data-access/friends-db";

type props = {
    friendsDb: IMakeFriendsDb["returnType"];
};

export default function makeGetFriends({ friendsDb }: props) {
    return async function getFriends(userId: string) {
        if (!userId) throw Error("User Id needs to be supplied.");

        return await friendsDb.getFriends(userId);
    };
}
