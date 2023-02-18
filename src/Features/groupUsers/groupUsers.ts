interface IGroupUser {
  groupId: string;
  userId: string;
  roles: string[];
  lastChecked: Date;
}

export default function makeGroupUser() {
  return function createGroupUser({
    groupId,
    userId,
    roles,
    lastChecked,
  }: IGroupUser) {
    if (groupId === null) throw new Error("Group Id must be string.");
    if (userId === null) throw new Error("UserId must be string.");
    if (roles === null) throw new Error("Roles must be array.");
    if (lastChecked === null || Number.isNaN(lastChecked.getTime()))
      throw new Error("LastChecked must be a real date.");

    return Object.freeze({
      getGroupId: () => groupId,
      getUserId: () => userId,
      getRoles: () => roles,
      getLastChecked: () => lastChecked,
    });
  };
}
