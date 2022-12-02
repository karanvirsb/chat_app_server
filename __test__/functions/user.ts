import { faker } from "@faker-js/faker";
import makeUsersDb from "../../src/Features/user/data-access/users-db";
import supertokens from "../../supertokens";
import makeSupertokenDb from "../../supertokens/data-access/supertokens-db";
import makeDb from "../fixures/db";

const userTests = Object.freeze({
    addTestUserToDB,
    deleteTestUser,
});
export default userTests;

async function addTestUserToDB({
    userId,
}: {
    userId: string;
}): Promise<boolean> {
    let SupertokensDb = makeSupertokenDb({ makeDb });
    // creating user if it does not exist
    const userDb = makeUsersDb({ makeDb });
    const foundUser = await userDb.findById({
        id: userId,
    });
    let addedUser, addUser;
    // if user does not exist create
    if (!foundUser.success || !foundUser.data) {
        addedUser = await SupertokensDb.addUser({
            user: {
                user_id: userId,
                email: `${faker.name.firstName()}@gmai.com`,
                password: "123",
                time_joined: Date.now(),
            },
        });
        if (addedUser.success && addedUser.data) {
            addUser = await userDb.insert({
                data: {
                    userId: addedUser.data.user_id,
                    status: "online",
                    username: `${faker.name.firstName()}-${faker.name.lastName()}`,
                },
            });
        }
    }
    if (addedUser && addUser) {
        return addUser?.success && addedUser?.success;
    }
    return false;
}

async function deleteTestUser({
    userId,
}: {
    userId: string;
}): Promise<boolean> {
    return (
        (await supertokens.deleteUser("cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"))
            .status === "OK"
    );
}
