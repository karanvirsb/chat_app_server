import { IHttpRequest } from "../../../express-callback";
import { IGroupUser } from "../groupUsers";
import { ZodError } from "zod";
import {
  makeUpdateGroupUserControllerDeps,
  IUpdateGroupUserC,
  makeUpdateGroupUserUCDeps,
  updateGroupUserProps,
  makeUpdateGroupUserDBADeps,
} from "../types/updateGroupUser";

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
