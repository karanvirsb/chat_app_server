import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeAddFriend from "../use-cases/addFriend";
import makeAddFriendController from "./add-friends";
import makeFakeFriends from "../../../../__test__/fixures/friends";
import makeFriendsDb from "../data-access/friends-db";

describe("Adding friend controller", () => {
    const friendsDb = makeFriendsDb({ makeDb });
    const addFriend = makeAddFriend({ friendsDb });
    const addFriendController = makeAddFriendController({ addFriend });

    afterEach(async () => {
        await clearDb("friends");
    });

    test("SUCCESS: adding friend", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: friend.userId, friendId: friend.friendId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriendController(friendRequest);
        expect(addedFriend.body.data?.userId).toBe(friend.userId);
    });

    test("ERROR: user id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: "", friendId: friend.friendId },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriendController(friendRequest);
        expect(addedFriend.body.error).toBe("User Id needs to be supplied");
    });

    test("ERROR: friend id missing", async () => {
        const friend = await makeFakeFriends(
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
            "312c0878-04c3-4585-835e-c66900ccc7a1"
        );

        const friendRequest = {
            body: { userId: friend.userId, friendId: "" },
            headers: {},
            ip: "",
            method: "POST",
            params: {},
            path: "",
            query: {},
        };

        const addedFriend = await addFriendController(friendRequest);
        expect(addedFriend.body.error).toBe("Friends Id needs to be supplied");
    });
});
