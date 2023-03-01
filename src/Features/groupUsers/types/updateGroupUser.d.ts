import { ZodError, z } from "zod";
import { IGroupUsersDb } from "../data-access";
import { DBUpdateStr } from "../../../Utilities/DBUpdateString";
import { httpResponseType } from "../../../express-callback";

import { IGroupUser, IGroupUserSchema } from "../groupUsers";

export const updateGroupUserProps = z.object({
  groupId: z.string().isUUID(),
  userId: z.string().isUUID(),
  updates: IGroupUserSchema.partial().omit({ gId: true, uId: true }),
});

export type updateGroupUserProps = z.infer<typeof updateGroupUserProps>;

export type makeUpdateGroupUserControllerDeps = {
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

export type makeUpdateGroupUserUCDeps = {
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

export type makeUpdateGroupUserDBADeps = {
  makeDb: IGroupUsersDb["makeDb"];
  DBUpdateStr: DBUpdateStr;
};
