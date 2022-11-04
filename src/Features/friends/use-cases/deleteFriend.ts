import makeFriends from "../index";
import { IMakeFriendsDb } from "../data-access/friends-db";

type props = {
    friendsDb: IMakeFriendsDb["returnType"];
};

export default function makeDeleteFriend({ friendsDb }: props) {
    return async function deleteFriend(userId: string, friendId: string) {
        if (!userId) throw Error("User Id needs to be supplied.");
        if (!friendId) throw Error("Friends Id needs to be supplied.");

        return await friendsDb.deleteFriend(userId, friendId);
    };
}
