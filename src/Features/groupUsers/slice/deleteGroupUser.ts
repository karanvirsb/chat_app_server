import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

export type deleteGroupUserDBAProps = {
  makeDb: IGroupUsersDb["makeDb"];
};

export function deleteGroupUserDBA({ makeDb }: deleteGroupUserDBAProps) {
  return async function deleteGroupUserDB({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) {
    const db = await makeDb();

    try {
      const query = `
      DELETE FROM "groupUsers" 
      WHERE "gId" = '${groupId}' AND "uId" = '${userId}' 
      RETURNING *`;

      const result = await db.query(query);

      if (result.rows.length >= 1) {
        const groupUser: IGroupUser = result.rows[0];
        return {
          success: true,
          data: groupUser,
          error: "",
        };
      } else {
        return {
          success: true,
          data: [],
          error: "Could not remove the user from the group.",
        };
      }
    } catch (error) {
      return {
        success: true,
        data: [],
        error: error + "",
      };
    } finally {
      db.release();
    }
  };
}
