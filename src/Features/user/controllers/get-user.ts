import { IGetUserUseCase } from "../use-cases/getUser";

export default function makeGetUser({ getUser }: IGetUserUseCase) {
    return async function getUserController(httpRequest: any) {
        const headers = {
            "Content-Type": "application/json",
        };

        try {
            const user = await getUser(httpRequest.params.email);
            return {
                headers,
                statusCode: 200,
                body: user,
            };
        } catch (error: any) {
            console.log(error);
            return {
                headers,
                statusCode: 400,
                body: {
                    error: error.message,
                },
            };
        }
    };
}
