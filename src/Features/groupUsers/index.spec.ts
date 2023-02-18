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
    const userWithoutGroupId = fakeGroupUser;
    userWithoutGroupId.groupId = "";
    expect(() => buildGroupUser(userWithoutGroupId)).toThrow(
      "Group Id must be string."
    );
  });
  it("ERROR: userid needs to exist", () => {});
  it("ERROR: roles needs to exist", () => {});
});
