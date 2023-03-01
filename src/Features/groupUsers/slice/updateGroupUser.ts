import { DBUpdateStr } from "../../../Utilities/DBUpdateString";
import { IGroupUsersDb } from "../data-access";
import { IGroupUser, IGroupUserSchema } from "../groupUsers";
import { ZodError, z } from "zod";

const updateGroupUserProps = z.object({
  groupId: z.string(),
  userId: z.string(),
  updates: IGroupUserSchema.partial().omit({ gId: true, uId: true }),
});

type updateGroupUserProps = {
  groupId: string;
  userId: string;
  updates: Partial<Omit<IGroupUser, "gId" | "uId">>;
};

type makeUpdateGroupUserUCDeps = {
  updateGroupUserDBA: ({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) => Promise<
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

export function makeUpdateGroupUserUC({
  updateGroupUserDBA,
}: makeUpdateGroupUserUCDeps) {
  return async function updateGroupUserUC({
    groupId,
    updates,
    userId,
  }: updateGroupUserProps) {
    try {
      // test with zod
      await updateGroupUserProps.safeParseAsync({
        groupId,
        updates,
        userId,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          data: undefined,
          error: error.format()._errors,
        };
      }
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    }
    // if zod passes
    return updateGroupUserDBA({ groupId, userId, updates });
  };
}

type makeUpdateGroupUserDBADeps = {
  makeDb: IGroupUsersDb["makeDb"];
  DBUpdateStr: DBUpdateStr;
};

export function makeUpdateGroupUserDBA({
  makeDb,
  DBUpdateStr,
}: makeUpdateGroupUserDBADeps) {
  return async function updateGroupUserDBA({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) {
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
