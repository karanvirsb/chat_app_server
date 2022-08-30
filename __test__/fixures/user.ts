import { faker } from "@faker-js/faker";
import cuid from "cuid";
import { IUser } from "../../src/Features/user/user";

export default async function makeFakeUser(): Promise<IUser> {
    return {
        userId: "1234",
        username: faker.name.firstName() + faker.color.human(),
        status: "online",
    };
}
