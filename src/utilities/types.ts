import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { SessionOptions } from "express-session";
import { ValidationChain } from "express-validator";
import multer = require("multer");

type Wrapper = (
  (router: Router) => void
);

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

// tslint:disable-next-line: interface-over-type-literal
type Route = {
  path: string,
  method: string,
  validator?: ValidationChain[],
  upload?: multer.Instance,
  handler: Handler | Handler[],
};

type SessionType = (
  expressSession: SessionOptions | undefined,
) => RequestHandler;

export {
  Wrapper,
  Handler,
  Route,
  SessionType,
};
