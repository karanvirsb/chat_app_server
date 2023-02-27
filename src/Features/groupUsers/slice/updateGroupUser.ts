import { DBUpdateStr } from "../../../Utilities/DBUpdateString";
import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

type makeUpdateGroupUserDBADeps = {
  makeDb: IGroupUsersDb["makeDb"];
  DBUpdateStr: DBUpdateStr;
};

type updateGroupUserDBAProps = {
  groupId: string;
  userId: string;
  updates: Partial<Omit<IGroupUser, "gId" | "uId">>;
};
export function makeUpdateGroupUserDBA({
  makeDb,
  DBUpdateStr,
}: makeUpdateGroupUserDBADeps) {
  return async function updateGroupUserDBA({
    groupId,
    userId,
    updates,
  }: updateGroupUserDBAProps) {
    const db = await makeDb();
    const updateStr = DBUpdateStr(updates);

    const query = `
      UPDATE "groupUsers" 
      SET ${updateStr} 
      WHERE "gId" = '${groupId}' 
        AND "uId" = '${userId}' 
      RETURNING "gId", "uId", "lastChecked"::TIMESTAMP WITH TIME ZONE, roles;
    `;
    try {
      const result = await db.query(query);

      if (result.rowCount >= 1) {
        const groupUser: IGroupUser = result.rows[0];
        return {
          success: true,
          data: groupUser,
          error: "",
        };
      }

      return {
        success: true,
        data: undefined,
        error: "Could not update group user.",
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: true,
          data: undefined,
          error: error.message,
        };
      }
      return {
        success: true,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  };
}
