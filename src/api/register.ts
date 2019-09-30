import { Request, Response } from "express";
import { METHOD_TYPE } from "./helpers/methodTypes";

const register = [{
  handler: async (req: Request, res: Response) => {
    const { username, password, passwordRepeat, email } = req.body;
    res.sendStatus(200);
  },
  method: METHOD_TYPE.POST,
  path: "/register",
}];

export { register };
