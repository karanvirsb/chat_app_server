import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

export type deleteGroupUserUCDependency = {
  deleteGroupUserDb: ({
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

export function deleteGroupUserUC({
  deleteGroupUserDb,
}: deleteGroupUserUCDependency) {
  return async function ({
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

    return await deleteGroupUserDb({ groupId, userId });
  };
}

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
