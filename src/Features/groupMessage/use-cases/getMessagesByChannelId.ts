import { IMakeMessageDb } from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";

type props = {
  messageDb: IMakeMessageDb["returnType"];
};

type returnData = Promise<{
  success: boolean;
  data: IGroupMessage[] | undefined;
  error: string;
}>;

export interface IGetMessagesByChannelIdUseCase {
  getMessagesByChannelId: (
    channelId: string,
    dateCreated: Date,
    limit: number
  ) => returnData;
}

export default function makeGetMessagesByChannelId({ messageDb }: props) {
  return async function getMessagesByChannelId(
    channelId: string,
    dateCreated: Date,
    limit: number = 15
  ): returnData {
    if (!channelId) throw new Error("Message Id needs to be supplied.");
    if (!dateCreated || Number.isNaN(dateCreated.getTime()))
      throw new Error("Date Created needs to be supplied.");

    return messageDb.getMessagesByChannelId(channelId, dateCreated, limit);
  };
}
