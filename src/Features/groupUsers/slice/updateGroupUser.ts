import { DBUpdateStr } from "../../../Utilities/DBUpdateString";
import { IHttpRequest, httpResponseType } from "../../../express-callback";
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

type makeUpdateGroupUserControllerDeps = {
  updateGroupUserUC: ({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) => Promise<{
    success: boolean;
    data: IGroupUser | undefined;
    error: string;
  }>;
};

export interface IUpdateGroupUserC extends httpResponseType {
  body: {
    success: boolean;
    data: IGroupUser | undefined;
    error: string;
  };
}

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

type makeUpdateGroupUserUCDeps = {
  updateGroupUserDBA: ({
    groupId,
    userId,
    updates,
  }: updateGroupUserProps) => Promise<{
    success: boolean;
    data: IGroupUser | undefined;
    error: string;
  }>;
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
