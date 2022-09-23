import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import QueryString from "qs";

export interface IHttpRequest {
    body: any;
    query: QueryString.ParsedQs;
    params: ParamsDictionary;
    ip: string;
    method: string;
    path: string;
    headers: {
        "Content-Type": string | undefined;
        Referer: string | undefined;
        "User-Agent": string | undefined;
    };
}

type httpResponse = {
    headers: { [string: string]: string };
    statusCode: number;
    body: {
        success: boolean;
        data: any | undefined;
        error: string;
    };
};

export interface IController {
    controller: (httpRequest: IHttpRequest) => Promise<httpResponse>;
}

export default function makeExpressCallback(
    controller: IController["controller"]
) {
    return (req: Request, res: Response) => {
        const httpRequest = {
            body: req.body,
            query: req.query,
            params: req.params,
            ip: req.ip,
            method: req.method,
            path: req.path,
            headers: {
                "Content-Type": req.get("Content-Type"),
                Referer: req.get("referer"),
                "User-Agent": req.get("User-Agent"),
            },
        };
        controller(httpRequest)
            .then((httpResponse: httpResponse) => {
                if (httpResponse.headers) {
                    res.set(httpResponse.headers);
                }
                res.type("json");
                res.status(httpResponse.statusCode).send(httpResponse.body);
            })
            .catch((e) =>
                res.status(500).send({ error: "An unkown error occurred." })
            );
    };
}
