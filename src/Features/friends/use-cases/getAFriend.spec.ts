import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";
import makeAddFriend from "./addFriend";
import makeGetAFriend from "./getAFriend";

describe("Get a friend use case", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const getAFriend = makeGetAFriend({ friendsDb });

    afterEach(async () => {
        await clearDb("friends");
    });

    test("SUCCESS: getting a friend", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        const friends = await addFriend(
            fakeFriends.userId,
            fakeFriends.friendId
        );

        const foundFriends = await getAFriend(
            fakeFriends.userId,
            fakeFriends.friendId
        );

        expect(foundFriends.data?.userId).toBe(fakeFriends.userId);
    });

    test("ERROR: missing user id", async () => {
        const fakeFriends = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );
        try {
            const friends = await addFriend(
                fakeFriends.userId,
                fakeFriends.friendId
            );

            const foundFriends = await getAFriend("", fakeFriends.friendId);
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
            const friends = await addFriend(
                fakeFriends.userId,
                fakeFriends.friendId
            );

            const foundFriends = await getAFriend(fakeFriends.userId, "");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Friends Id needs to be supplied.");
        }
    });
});
