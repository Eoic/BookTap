import { Request, Response } from "express";
import { METHOD_TYPE } from "./helpers/methodTypes";

const login = [{
    handler: async (req: Request, res: Response) => {
        res.sendStatus(200);
    },
    method: METHOD_TYPE.POST,
    path: "/login",
}];

export { login };
