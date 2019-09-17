import { Request, Response } from "express";

const index = [{
  handler: async (req: Request, res: Response) => {
    res.json({ msg: "Home" });
  },
  method: "get",
  path: "/",
}];

export { index };
