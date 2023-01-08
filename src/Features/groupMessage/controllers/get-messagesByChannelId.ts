import { Pagination } from "../../../Utilities/pagination/pagination";
import {
  IHttpRequest,
  httpResponseType,
} from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { IGetMessagesByChannelIdUseCase } from "../use-cases/getMessagesByChannelId";

interface IGetMessagesByChannelIdResponse extends httpResponseType {
  body: {
    success: boolean;
    data: Pagination<IGroupMessage> | undefined;
    error: string;
  };
}

export default function makeGetMessagesByChannelIdController({
  getMessagesByChannelId,
}: IGetMessagesByChannelIdUseCase) {
  return async function getMessagesByChannelIdController(
    httpRequest: IHttpRequest
  ): Promise<IGetMessagesByChannelIdResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const foundMessages = await getMessagesByChannelId(
        httpRequest.body.channelId,
        new Date(httpRequest.body.dateCreated),
        parseInt(httpRequest.body.limit)
      );
      return {
        headers,
        statusCode: 200,
        body: foundMessages,
      };
    } catch (error: any) {
      console.log(error);
      return {
        headers,
        statusCode: 400,
        body: {
          success: false,
          data: undefined,
          error: error.message,
        },
      };
    }
  };
}
