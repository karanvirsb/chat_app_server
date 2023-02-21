import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

export function deleteGroupUserC() {}

export type deleteGroupUserUCDependency = {
  deleteGroupUserDBA: ({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) => Promise<
    | {
        success: boolean;
        data: IGroupUser;
        error: string;
      }
    | {
        success: boolean;
        data: undefined;
        error: string;
      }
  >;
};

export function makeDeleteGroupUserUC({
  deleteGroupUserDBA,
}: deleteGroupUserUCDependency) {
  return async function deleteGroupUserUC({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) {
    if (groupId.length === 0 || groupId === null) {
      throw new Error(
        "GroupId must be a string and must have length greater than 0."
      );
    }
    if (userId.length === 0 || userId === null) {
      throw new Error(
        "UserId must be a string and must have length greater than 0."
      );
    }

    return await deleteGroupUserDBA({ groupId, userId });
  };
}

export type deleteGroupUserDBAProps = {
  makeDb: IGroupUsersDb["makeDb"];
};

export function makeDeleteGroupUserDBA({ makeDb }: deleteGroupUserDBAProps) {
  return async function deleteGroupUserDBA({
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
          data: undefined,
          error: "Could not remove the user from the group.",
        };
      }
    } catch (error) {
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
