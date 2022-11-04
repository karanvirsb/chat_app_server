import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddFriend from "../use-cases/addFriend";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";
import makeGetAFriend from "../use-cases/getAFriend";
import makeGetAFriendController from "./get-aFriend";

describe("Getting a friend controller", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const getAFriend = makeGetAFriend({ friendsDb });
    const getAFriendController = makeGetAFriendController({ getAFriend });

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
            params: { userId: friend.userId, friendId: friend.friendId },
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const foundFriend = await getAFriendController(friendRequest);
        expect(foundFriend.body.data?.userId).toBe(friend.userId);
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
            params: { userId: "", friendId: friend.friendId },
            path: "",
            query: {},
        };
        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const foundFriend = await getAFriendController(friendRequest);

        expect(foundFriend.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: friend id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: {},
            headers: {},
            ip: "",
            method: "POST",
            params: {
                userId: friend.userId,
                friendId: "",
            },
            path: "",
            query: {},
        };

        const addedFriend = await addFriend(friend.userId, friend.friendId);
        const foundFriend = await getAFriendController(friendRequest);

        expect(foundFriend.body.error).toBe("Friends Id needs to be supplied.");
    });
});
