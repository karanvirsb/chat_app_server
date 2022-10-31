import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";

type props = {
    channelDb: IMakePrivateChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel | undefined;
    error: string;
}>;

export interface IGetPrivateChannelByIdUseCase {
    getPrivateChannelById: (channelId: string) => Promise<returnData>;
}

export default function makeGetPrivateChannelById({
    channelDb,
}: props): IGetPrivateChannelByIdUseCase["getPrivateChannelById"] {
    return async function getPrivateChannelById(
        channelId: string
    ): Promise<returnData> {
        if (!channelId) throw new Error("Channel Id needs to be supplied");

        return await channelDb.getPrivateChannelById(channelId);
    };
}
