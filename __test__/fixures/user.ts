import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export default function makeFakeUser() {
    return {
        userId: nanoid(),
        username: faker.name.firstName() + faker.color.human(),
        email: `${faker.name.fullName()}@gmail.com`,
        password: bcrypt.hash(faker.random.word(), 10),
        status: "online",
        refreshToken: faker.random.alphaNumeric(256),
    };
}
