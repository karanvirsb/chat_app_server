import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { ICreateMessageUseCase } from "../use-cases/createMessage";

interface ICreateMessageResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupMessage | undefined;
        error: string;
    };
}

export default function makeCreateMessageController({
    createMessage,
}: ICreateMessageUseCase) {
    return async function createMessageController(
        httpRequest: IHttpRequest
    ): Promise<ICreateMessageResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const createdMessage = await createMessage(
                httpRequest.body.messageInfo
            );
            return {
                headers,
                statusCode: 200,
                body: createdMessage,
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