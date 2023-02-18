import makeDb from "../../../../__test__/fixures/db";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";
import {
  makeCreateGroupDBAccess,
  makeCreateGroupUseCase,
} from "./createGroupUser";

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
      gId: "123",
      uId: "123",
      roles: ["2000"],
      lastChecked: new Date(),
    });
    console.log(groupUser);
    expect(groupUser.data?.gId).toBe("123");

    expect(groupUser.data?.uId).toBe("123");
  });

  it("SUCCESS: Created group user", async () => {
    const createGroupMocked = jest.fn(createGroupDb);
    createGroupMocked.mockResolvedValueOnce(
      Promise.resolve({
        success: true,
        data: {
          gId: "123",
          uId: "123",
          roles: ["2000"],
          lastChecked: new Date(),
        },
        error: "",
      })
    );
    let createGroupUseCase = makeCreateGroupUseCase({
      createGroupDb: createGroupMocked,
    });
    const createdGroupUser = await createGroupUseCase({
      gId: "123",
      uId: "123",
      roles: ["2000"],
      lastChecked: new Date(),
    });

    expect(createdGroupUser.data?.gId).toBe("123");
    expect(createdGroupUser.data?.gId).toBe("123");
  });

  it("ERROR: Created group user does not have group id", async () => {
    const createGroupMocked = jest.fn(createGroupDb);

    let createGroupUseCase = makeCreateGroupUseCase({
      createGroupDb: createGroupMocked,
    });

    try {
      const createdGroupUser = await createGroupUseCase({
        gId: "",
        uId: "123",
        roles: ["2000"],
        lastChecked: new Date(),
      });
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group Id must be string.");
    }
  });
});
