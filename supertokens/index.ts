import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";

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

                            // First we call the original implementation of signUpPOST.
                            let response =
                                await originalImplementation.signUpPOST(input);

                            // Post sign up response, we check if it was successful
                            if (response.status === "OK") {
                                const user: { [key: string]: string } = {};

                                // These are the input form fields values that the user used while signing up
                                let formFields = input.formFields;

                                // so here we are adding email, username
                                formFields.forEach((field) => {
                                    if (field.id !== "password") {
                                        user[field.id] = field.value;
                                    }
                                });

                                user["status"] = "online";
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
