import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { IUser } from "../../src/Features/user/user";

export default async function makeFakeUser(): Promise<IUser> {
    return {
        userId: nanoid(),
        username: faker.name.firstName() + faker.color.human(),
        email: `${faker.name.fullName()}@gmail.com`,
        password: await bcrypt.hash(faker.random.word(), 10),
        status: "online",
        refreshToken: faker.random.alphaNumeric(256),
    };
}
