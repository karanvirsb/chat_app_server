import buildGroupUser from ".";
import { IGroupUser } from "./groupUsers";

describe("Testing group user", () => {
  const fakeGroupUser: IGroupUser = {
    groupId: "123",
    lastChecked: new Date(),
    roles: ["2000"],
    userId: "123",
  };
  it("SUCCESS: group user created", () => {
    const user = buildGroupUser(fakeGroupUser);
    expect(user.getUserId()).toBe(fakeGroupUser.userId);
    expect(user.getGroupId()).toBe(fakeGroupUser.groupId);
  });
  it("ERROR: groupid needs to exist", () => {
    const userWithoutGroupId = structuredClone(fakeGroupUser);
    userWithoutGroupId.groupId = "";
    expect(() => buildGroupUser(userWithoutGroupId)).toThrow(
      "Group Id must be string."
    );
  });
  it("ERROR: userid needs to exist", () => {
    const userWithoutUserId = structuredClone(fakeGroupUser);
    userWithoutUserId.userId = "";
    expect(() => buildGroupUser(userWithoutUserId)).toThrow(
      "UserId must be string."
    );
  });
  it("ERROR: roles needs to exist", () => {
    const userWithoutRoles = structuredClone(fakeGroupUser);
    userWithoutRoles.roles = [];
    expect(() => buildGroupUser(userWithoutRoles)).toThrow(
      "Roles must be an array."
    );
  });
});