import { IGroupMessage } from "../../src/Features/groupMessage/groupMessage";

export interface ICreateGroupMessageEvent {
  groupId: string;
  payload: { messageInfo: IGroupMessage };
}

export interface IUpdateGroupMessageEvent {
  groupId: string;
  payload: { messageInfo: IGroupMessage; pageIndex: number; currIndex: number };
}

export interface IDeleteGroupMessageEvent {
  groupId: string;
  payload: { messageId: string; channelId: string };
}
