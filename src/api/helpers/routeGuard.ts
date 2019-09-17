import { NextFunction, Request, Response } from "express";

const routeVerifier = {
  allowAuthorizedOnly: async (req: Request, res: Response, next: NextFunction) => {
    return (routeVerifier.isAuthorized(req, res)) ? next() : res.redirect("/");
  },
  allowUnauthorizedOnly: async (req: Request, res: Response, next: NextFunction) => {
    return (routeVerifier.isAuthorized(req, res)) ? res.redirect("/") : next();
  },
  isAuthorized: (req: Request, res: Response) => {
    if (req.session) {
      if (req.session.userId) {
        return true;
      }
    }
    return false;
  },
};

export { routeVerifier };
