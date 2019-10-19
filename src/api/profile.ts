import { Request, Response } from "express";
import { METHOD_TYPE } from "./helpers/methodTypes";

const profile = [{
  handler: async (req: Request, res: Response) => {
    res.send("Prifile data.");
    res.sendStatus(200);
  },
  method: METHOD_TYPE.GET,
  path: "/profile",
}];

export { profile };
