import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";
import makeAddFriend from "./addFriend";
import makeDeleteFriend from "./deleteFriend";

describe("Delete friend use case", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const deleteFriends = makeDeleteFriend({ friendsDb });

    afterEach(async () => {
        clearDb("friends");
    });

    test("SUCCESS: Deleting friends", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        const friends = await addFriend(
            fakeFriends.userId,
            fakeFriends.friendId
        );

        const deletedFriend = await deleteFriends(
            fakeFriends.userId,
            fakeFriends.friendId
        );

        expect(deletedFriend.data?.userId).toBe(fakeFriends.userId);
    });

    test("ERROR: missing user id", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        const friends = await addFriend(
            fakeFriends.userId,
            fakeFriends.friendId
        );
        try {
            const deletedFriend = await deleteFriends(
                "",
                "312c0878-04c3-4585-835e-c66900ccc7a1"
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("User Id needs to be supplied.");
        }
    });

    test("ERROR: missing Friend id", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        try {
            // const friends = await addFriend(
            //     fakeFriends.userId,
            //     fakeFriends.friendId
            // );
            const deletedFriend = await deleteFriends(
                "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
                ""
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Friends Id needs to be supplied.");
        }
    });
});
