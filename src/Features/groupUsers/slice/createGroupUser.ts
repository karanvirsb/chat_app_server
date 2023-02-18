import { IGroupUsersDb } from "../data-access";
import { IGroupUser } from "../groupUsers";

export function makeCreateGroupUseCase() {}

type makeCreateGroupDBAccessProps = {
  makeDb: IGroupUsersDb["makeDb"];
};

export function makeCreateGroupDBAccess({
  makeDb,
}: makeCreateGroupDBAccessProps) {
  return async function createGroupDb({
    groupId,
    userId,
    lastChecked,
    roles,
  }: IGroupUser) {
    const db = await makeDb(); // creating db access
    try {
      const q = `INSERT INTO "groupUsers" values('${groupId}', '${userId}', '{${roles.join(
        ", "
      )}}', to_timestamp(${lastChecked.getTime()}/1000),) RETURNING *;`;
      const result = await db.query(q);

      if (result.rows.length >= 1) {
        const groupUser = result.rows[0];
        return { success: true, data: groupUser, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not insert group user",
        };
      }
    } catch (error) {
      console.log("🚀 ~ file: createGroupUser.ts:35 ~ error", error);

      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  };
}
