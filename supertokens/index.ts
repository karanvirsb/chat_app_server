import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import {
    addUser,
    editUserByUsername,
    getUser,
} from "../src/Features/user/use-cases";
import { IUser } from "../src/Features/user/user";
import { GeneralErrorResponse } from "supertokens-node/lib/build/types";

type signupResponse =
    | {
          status: "OK";
          user: EmailPassword.User;
          session: Session.SessionContainer;
      }
    | {
          status: "EMAIL_ALREADY_EXISTS_ERROR";
      }
    | GeneralErrorResponse;

supertokens.init({
    framework: "express",
    supertokens: {
        // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connectionURI: "http://localhost:8001",
        // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "chat app",
        apiDomain: "http://localhost:8000",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
                formFields: [
                    {
                        id: "username",
                    },
                    {
                        id: "email",
                    },
                    {
                        id: "password",
                    },
                ],
            },
            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signUpPOST: async function (input) {
                            if (
                                originalImplementation.signUpPOST === undefined
                            ) {
                                throw Error("Should never come here");
                            }

                            const user: IUser = createUserObj(input);
                            // adding user into database
                            try {
                                const addedUser = await addUser(user);
                                if (addedUser.error) {
                                    throw new Error(addedUser.error);
                                }
                            } catch (err) {
                                console.log(err);
                                return {
                                    status: "GENERAL_ERROR",
                                    message: `${err}`,
                                };
                            }

                            let response: signupResponse;
                            try {
                                response =
                                    await originalImplementation.signUpPOST(
                                        input
                                    );

                                if (response.status === "OK") {
                                    response.user = {
                                        ...response.user,
                                        ...user,
                                    };
                                    await editUserByUsername({
                                        username: user.username,
                                        updates: { userId: response.user.id },
                                    });
                                }
                            } catch (error) {
                                console.log(error);
                                return {
                                    status: "GENERAL_ERROR",
                                    message: `${error}`,
                                };
                            }
                            return response;
                        },
                        signInPOST: async function (input) {
                            if (
                                originalImplementation.signInPOST === undefined
                            ) {
                                throw Error("Should never come here");
                            }

                            // First we call the original implementation of signInPOST.
                            let response =
                                await originalImplementation.signInPOST(input);

                            try {
                                // Post sign up response, we check if it was successful
                                if (response.status === "OK") {
                                    let { id } = response.user;

                                    const user = await getUser(id);

                                    if (
                                        user.success &&
                                        user.data !== undefined
                                    ) {
                                        response.user = {
                                            ...response.user,
                                            ...user.data,
                                        };
                                    } else {
                                        throw new Error(user.error);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                                return {
                                    status: "GENERAL_ERROR",
                                    message: `${error}`,
                                };
                            }
                            return response;
                        },
                    };
                },
            },
        }), // initializes signin / sign up features
        Session.init(), // initializes session features
    ],
});

function createUserObj(input: {
    formFields: { id: string; value: string }[];
    options: EmailPassword.APIOptions;
    userContext: any;
}) {
    const user: IUser = {
        userId: "",
        status: "",
        username: "",
    };

    // These are the input form fields values that the user used while signing up
    let formFields = input.formFields;

    // so here we are adding email, username
    formFields.forEach((field) => {
        if (field.id === "username") {
            user[field.id] = field.value;
        }
    });

    user["status"] = "online";
    return user;
}

export default supertokens;
