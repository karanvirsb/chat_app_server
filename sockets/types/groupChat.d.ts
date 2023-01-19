import { IGroupMessage } from "../../src/Features/groupMessage/groupMessage";

export interface ICreateGroupMessageEvent {
  channelId: string;
  payload: { messageInfo: IGroupMessage };
}

export interface IUpdateGroupMessageEvent {
  channelId: string;
  payload: { messageInfo: Partial<IGroupMessage> };
}

export interface IDeleteGroupMessageEvent {
  channelId: string;
  payload: { messageId: string };
}
