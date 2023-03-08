import { IHttpRequest } from "../../../express-callback";
import { IGroupUser, IGroupUserSchema } from "../groupUsers";
import { ZodError, z } from "zod";
import type {
  makeUpdateGroupUserControllerDeps,
  IUpdateGroupUserC,
  updateGroupUserProps,
  makeUpdateGroupUserUCDeps,
  makeUpdateGroupUserDBADeps,
} from "../types/updateGroupUser";

export const updateGroupUserPropsSchema = z.object({
  groupId: IGroupUserSchema.shape.gId,
  userId: IGroupUserSchema.shape.uId,
  updates: IGroupUserSchema.partial().omit({ gId: true, uId: true }),
});

export function updateGroupUserController({
  updateGroupUserUC,
}: makeUpdateGroupUserControllerDeps) {
  return async function (
    httpRequest: IHttpRequest
  ): Promise<IUpdateGroupUserC> {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const updateParams = {
        groupId: httpRequest.body.groupId,
        userId: httpRequest.body.userId,
        updates: httpRequest.body.updates,
      };
      const result = await updateGroupUserUC(updateParams);
      return { body: result, headers, statusCode: 200 };
    } catch (error) {
      if (error instanceof Error) {
        return {
          body: { success: false, error: error.message, data: undefined },
          headers,
          statusCode: 400,
        };
      }
      return {
        body: { success: false, error: error + "", data: undefined },
        headers,
        statusCode: 400,
      };
    }
  };
}

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
      const result = await updateGroupUserPropsSchema.safeParseAsync({
        groupId,
        updates,
        userId,
      });
      console.log("🚀 ~ file: updateGroupUser.ts:67 ~ result:", result);
      if (!result.success) {
        throw new ZodError(result.error.issues);
      }
    } catch (error: unknown) {
      return {
        success: false,
        data: undefined,
        error: error,
      };
    }
    // if zod passes
    return updateGroupUserDBA({ groupId, userId, updates });
  };
}

export function makeUpdateGroupUserDBA({
  makeDb,
  DBUpdateStr,
}: makeUpdateGroupUserDBADeps) {
  return async function updateGroupUserDBA({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps): Promise<DBAccessReturn<IGroupUser>> {
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
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not update group user.",
        };
      }
    } catch (error) {
      return {
        success: true,
        data: undefined,
        error: error,
      };
    } finally {
      db.release();
    }
  };
}
