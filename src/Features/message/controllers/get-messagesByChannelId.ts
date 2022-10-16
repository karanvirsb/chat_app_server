import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IMessage } from "../message";
import { IGetMessagesByChannelIdUseCase } from "../use-cases/getMessagesByChannelId";

interface IGetMessagesByChannelIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IMessage[] | undefined;
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
                httpRequest.params.messageId,
                new Date(httpRequest.params.dateCreated),
                parseInt(httpRequest.params.limit)
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
