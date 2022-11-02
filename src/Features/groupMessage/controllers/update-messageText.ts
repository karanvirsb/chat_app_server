import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IMessage } from "../groupMessage";
import { IUpdateMessageTextUseCase } from "../use-cases/updateMessageText";

interface IUpdateMessageTextResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IMessage | undefined;
        error: string;
    };
}

export default function makeUpdateMessageTextController({
    updateMessageText,
}: IUpdateMessageTextUseCase) {
    return async function updateMessageTextController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateMessageTextResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedMessage = await updateMessageText(
                httpRequest.body.messageId,
                httpRequest.body.updateValue
            );
            return {
                headers,
                statusCode: 200,
                body: updatedMessage,
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
