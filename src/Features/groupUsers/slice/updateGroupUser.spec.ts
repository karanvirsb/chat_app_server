import cuid from "cuid";
import groupTests from "../../../../__test__/functions/group";
import groupUserTests from "../../../../__test__/functions/groupUser";
import userTests from "../../../../__test__/functions/user";
import DBUpdateStr from "../../../Utilities/DBUpdateString";
import { makeDb } from "../data-access";
import {
  makeUpdateGroupUserDBA,
  makeUpdateGroupUserUC,
} from "./updateGroupUser";
import { IGroupUser } from "../groupUsers";

describe("Testing update group user DB Access", () => {
  const updateGroupUserDBA = makeUpdateGroupUserDBA({ makeDb, DBUpdateStr });
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
  it("Successfully updating group roles", async () => {
    const result = await updateGroupUserDBA({
      groupId: "123",
      userId: "123",
      updates: { roles: ["2000", "2001"] },
    });
    expect(result.data?.roles).toEqual(["2000", "2001"]);
  });
  it("Successfully updating lastChecked", async () => {
    const date = new Date();
    const result = await updateGroupUserDBA({
      groupId: "123",
      userId: "123",
      updates: { lastChecked: date },
    });
    expect(result.data?.lastChecked.toUTCString()).toEqual(date.toUTCString());
  });
});

describe("Testing update group user use case", () => {
  const uuid = cuid();
  const updateGroupUserDBA = makeUpdateGroupUserDBA({ makeDb, DBUpdateStr });
  const updateGroupUserDBAMock = jest
    .fn<typeof updateGroupUserDBA, []>()
    .mockImplementation(() => ({ groupId, userId, updates }) => {
      return Promise.resolve({
        success: true,
        data: {
          gId: groupId,
          uId: userId,
          roles: ["2000"],
          lastChecked: new Date(),
          ...updates,
        } as IGroupUser,
        error: "",
      });
    });
  const updateGroupUserUC = makeUpdateGroupUserUC({
    updateGroupUserDBA: new updateGroupUserDBAMock(),
  });
  beforeAll(async () => {
    let testUser = await userTests.addTestUserToDB({ userId: uuid });
    let testGroup = await groupTests.createTestGroup({
      groupId: uuid,
      userId: uuid,
    });
    let testGroupUser = await groupUserTests.createGroupUserTest({
      groupId: uuid,
      userId: uuid,
    });
  });

  afterAll(async () => {
    let testUser = await userTests.deleteTestUser({ userId: uuid });
    let testGroup = await groupTests.deleteTestGroup({
      groupId: uuid,
      userId: uuid,
    });
    let testGroupUser = await groupUserTests.deleteGroupUserTest({
      groupId: uuid,
      userId: uuid,
    });
  });

  it("SUCCESS: update group user use case", async () => {
    const date = new Date();
    const updateParams = {
      groupId: uuid,
      userId: uuid,
      updates: {
        roles: ["2000", "2001"],
        lastChecked: date,
      },
    };

    const result = await updateGroupUserUC(updateParams);
    expect(result.data?.roles).toEqual(updateParams.updates.roles);
  });
});
