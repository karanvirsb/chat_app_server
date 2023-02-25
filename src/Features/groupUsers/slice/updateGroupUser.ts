import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

type makeUpdateGroupUserDBADeps = {
  makeDb: IGroupUsersDb["makeDb"];
};

export function makeUpdateGroupUserDBA({ makeDb }: makeUpdateGroupUserDBADeps) {
  type updateGroupUserDBAProps = {
    groupId: string;
    userId: string;
    updates: Partial<Omit<IGroupUser, "gId" | "uId">>;
  };
  return async function updateGroupUserDBA({
    groupId,
    userId,
    updates,
  }: updateGroupUserDBAProps) {
    const db = await makeDb();
    const lastCheckedToStr = updates.lastChecked
      ? `to_timestamp(${updates.lastChecked.getTime()}/1000)`
      : "";
    const rolesToStr = updates.roles ? `'{${updates.roles.join(", ")}}'` : "";
    // { lastChecked: lastCheckedToStr, roles: rolesToStr }
  };
}
