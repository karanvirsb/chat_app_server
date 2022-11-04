import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddFriend from "../use-cases/addFriend";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";
import makeGetFriends from "../use-cases/getFriends";
import makeGetFriendsController from "./get-Friends";

describe("Getting friends controller", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const getFriends = makeGetFriends({ friendsDb });
    const getFriendsController = makeGetFriendsController({ getFriends });

    afterEach(async () => {
        await clearDb("friends");
    });

    test("SUCCESS: getting a friend", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { userId: friend.userId },
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const foundFriend = await getFriendsController(friendRequest);
        if (foundFriend.body.data)
            expect(foundFriend.body.data[0].userId).toBe(friend.userId);
    });

    test("ERROR: user id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: { userId: "" },
            path: "",
            query: {},
        };
        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const foundFriend = await getFriendsController(friendRequest);

        expect(foundFriend.body.error).toBe("User Id needs to be supplied.");
    });
});
