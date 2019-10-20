import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Handler } from "../../utilities/types";

export const verifyToken: Handler = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, String(process.env.JWT_SECRET), (err, data) => {
      if (err) {
        res.status(403).json({ message: "Provided token is invalid." });
        return;
      }

      (req as any).user = data;
      next();
    });
  } else {
    res.status(403).json({ message: "Authorization token not provided." });
    return;
  }
};
