import { IFriendsDb } from ".";
import { IFriends } from "../friends";

type props = {
    makeDb: IFriendsDb["makeDb"];
};

type returnData = Promise<{
    success: boolean;
    data: undefined | IFriends;
    error: string;
}>;

export interface IMakeFriendsDb {
    returnType: Readonly<{
        addFriend: (friendInfo: IFriends) => returnData;
        deleteFriend: (userId: string, friendId: string) => returnData;
    }>;
}

export default function makeFriendsDb({
    makeDb,
}: props): IMakeFriendsDb["returnType"] {
    return Object.freeze({ addFriend, deleteFriend });

    async function addFriend(friendInfo: IFriends): returnData {
        const db = await makeDb();
        try {
            const query = `INSERT INTO friends VALUES(
                '${friendInfo.userId}',
                '${friendInfo.friendId}',
                '${friendInfo.dateAdded}',
            ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const friend: IFriends = res.rows[0];
                friend.dateAdded = new Date(friend.dateAdded);
                return { success: true, data: friend, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not add friend.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: friends-db.ts ~ line 39 ~ addFriend ~ error",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
}
