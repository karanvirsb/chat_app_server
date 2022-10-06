import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IAddGroup } from "../use-cases/addGroup";

export default function makeAddGroupController({ addGroup }: IAddGroup) {
    return async function addGroupController(
        httpRequest: IHttpRequest
    ): Promise<httpResponseType> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedGroup = await addGroup(
                httpRequest.body.groupInfo,
                httpRequest.body.userId
            );
            return {
                headers,
                statusCode: 200,
                body: addedGroup,
            };
        } catch (error: any) {
            console.log(error);
            return {
                headers,
                statusCode: 400,
                body: {
                    success: false,
                    data: [],
                    error: error.message,
                },
            };
        }
    };
}
