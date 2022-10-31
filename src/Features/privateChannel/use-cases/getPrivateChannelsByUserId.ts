import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";

type props = {
    channelDb: IMakePrivateChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel[] | undefined;
    error: string;
}>;

export interface IGetPrivateChannelsByUserIdUseCase {
    getPrivateChannelsByUserId: (userId: string) => Promise<returnData>;
}

export default function makeGetPrivateChannelsByUserId({
    channelDb,
}: props): IGetPrivateChannelsByUserIdUseCase["getPrivateChannelsByUserId"] {
    return async function getPrivateChannelsByUserId(
        userId: string
    ): Promise<returnData> {
        if (!userId) throw new Error("User Id needs to be supplied");

        return await channelDb.getPrivateChannelsByUserId(userId);
    };
}
