import cuid from "cuid";

export interface IInviteCodeGenerator {
    makeInviteCode: () => string;
}

export default function inviteCodeGenerator() {
    return cuid.slug();
}
