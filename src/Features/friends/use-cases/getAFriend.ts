import { IMakeFriendsDb } from "../data-access/friends-db";

type props = {
    friendsDb: IMakeFriendsDb["returnType"];
};

export default function makeGetAFriend({ friendsDb }: props) {
    return async function getAFriend(userId: string, friendId: string) {
        if (!userId) throw Error("User Id needs to be supplied.");
        if (!friendId) throw Error("Friends Id needs to be supplied.");

        return await friendsDb.getAFriend(userId, friendId);
    };
}
