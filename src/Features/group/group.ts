import { IId } from "../../Utilities/id";

type props = {
    Id: IId;
};

export interface IGroup {
    groupName: string;
    groupId: string;
    inviteCode: string;
}

export default function buildGroup({ Id }: props) {
    return function makeGroup({
        groupName,
        groupId = Id.makeId(),
        inviteCode,
    }: IGroup) {
        return {
            getGroupName: () => groupName,
            getGroupId: () => groupId,
            getInviteCode: () => inviteCode,
        };
    };
}
