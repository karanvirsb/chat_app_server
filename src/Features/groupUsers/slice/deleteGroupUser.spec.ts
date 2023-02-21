import { makeDeleteGroupUserDBA } from "./deleteGroupUser";
import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import groupUserTests from "../../../../__test__/functions/groupUser";

describe("Testing deleting group user DB", () => {
  const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
  beforeAll(async () => {
    let testUser = await userTests.addTestUserToDB({ userId: "123" });
    let testGroup = await groupTests.createTestGroup({
      groupId: "123",
      userId: "123",
    });
    let testGroupUser = await groupUserTests.createGroupUserTest({
      groupId: "123",
      userId: "123",
    });
  });

  afterAll(async () => {
    let testUser = await userTests.deleteTestUser({ userId: "123" });
    let testGroup = await groupTests.deleteTestGroup({
      groupId: "123",
      userId: "123",
    });
    let testGroupUser = await groupUserTests.deleteGroupUserTest({
      groupId: "123",
      userId: "123",
    });
  });
  it("Create user successfully", async () => {
    const deleteGroupUser = await deleteGroupUserDBA({
      groupId: "123",
      userId: "123",
    });
    console.log(deleteGroupUser);
    expect(deleteGroupUser.data?.gId).toBe("123");

    expect(deleteGroupUser.data?.uId).toBe("123");
  });
});
