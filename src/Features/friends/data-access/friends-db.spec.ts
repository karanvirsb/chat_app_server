import makeFriendsDb from "./friends-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import { IFriends } from "../friends";
import makeFakeFriends from "../../../../__test__/fixures/friends";

describe("friends DB testing", () => {
    const friendsDb = makeFriendsDb({ makeDb });

    afterAll(async () => {
        clearDb("friends");
    });

    test("SUCCESS: creating a friend", async () => {
        const friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedFriend = await friendsDb.addFriend(friends);

        expect(addedFriend.data?.userId).toBe(friends.userId);
    });

    test("SUCCESS: Deleted friend", async () => {
        const friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const addedFriend = await friendsDb.addFriend(friends);
        const deletedFriend = await friendsDb.deleteFriend(
            friends.userId,
            friends.friendId
        );

        expect(deletedFriend.data?.userId).toBe(friends.userId);
    });

    test("Get friends", async () => {
        let friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        let addFriends = await friendsDb.addFriend(friends);
        friends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
        );
        addFriends = await friendsDb.addFriend(friends);
        const allFriends = await friendsDb.getFriends(friends.userId);

        if (allFriends.data)
            expect(allFriends.data[allFriends.data?.length - 1].friendId).toBe(
                friends.friendId
            );
    });
});
