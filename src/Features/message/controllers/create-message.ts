import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IMessage } from "../message";
import { ICreateMessageUseCase } from "../use-cases/createMessage";

interface ICreateMessageResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IMessage | undefined;
        error: string;
    };
}

export default function makeAddGroupController({
    createMessage,
}: ICreateMessageUseCase) {
    return async function addGroupController(
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
