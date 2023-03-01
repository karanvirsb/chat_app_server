import { z } from "zod";
export const IGroupUserSchema = z.object({
  gId: z.string(),
  lastChecked: z.date(),
  roles: z.array(z.string()),
  uId: z.string(),
});

export type IGroupUser = z.infer<typeof IGroupUserSchema>;

export default function makeGroupUser() {
  return function createGroupUser({
    gId,
    uId,
    roles,
    lastChecked,
  }: IGroupUser) {
    if (gId === null || gId.length <= 0)
      throw new Error("Group Id must be string.");
    if (uId === null || uId.length <= 0) throw new Error("uId must be string.");
    if (roles === null || roles.length <= 0)
      throw new Error("Roles must be an array.");
    if (lastChecked === null || Number.isNaN(lastChecked.getTime()))
      throw new Error("LastChecked must be a real date.");

    return Object.freeze({
      getgId: () => gId,
      getuId: () => uId,
      getRoles: () => roles,
      getLastChecked: () => lastChecked,
    });
  };
}
