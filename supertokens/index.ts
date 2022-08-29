import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { addUser } from "../src/Features/user/use-cases";
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

                            let response: signupResponse;

                            // Post sign up response, we check if it was successful

                            const user: IUser = {
                                userId: "",
                                email: "",
                                status: "",
                                username: "",
                            };

                            // These are the input form fields values that the user used while signing up
                            let formFields = input.formFields;

                            // so here we are adding email, username
                            formFields.forEach((field) => {
                                if (
                                    field.id === "email" ||
                                    field.id === "username"
                                ) {
                                    user[field.id] = field.value;
                                }
                            });

                            user["status"] = "online";
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

export default supertokens;
