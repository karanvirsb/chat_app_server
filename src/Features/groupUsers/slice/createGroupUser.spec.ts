import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import { makeCreateGroupDBAccess } from "./createGroupUser";

describe("Create Group User Tests", () => {
  let createGroupDb = makeCreateGroupDBAccess({ makeDb });
  beforeAll(async () => {
    let testUser = await userTests.addTestUserToDB({ userId: "123" });
    let testGroup = await groupTests.createTestGroup({
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
  });
  it("Create user successfully", async () => {
    const groupUser = await createGroupDb({
      groupId: "123",
      userId: "123",
      roles: ["2000"],
      lastChecked: new Date(),
    });
    console.log(groupUser);
    expect(groupUser.data?.groupId).toBe("123");
    expect(groupUser.data?.userId).toBe("123");
  });
});
