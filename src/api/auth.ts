import { Request, Response } from "express";
import passport = require("passport");
import { METHOD_TYPE } from "./helpers/methodTypes";

const auth = [{
    /*
    method: METHOD_TYPE.GET,
    path: "/auth/google/callback",
    handler: async (req: Request, res: Response) => {
        passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/profile" });
    },
    */
}];

export { auth };
