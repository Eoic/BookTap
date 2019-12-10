import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Router } from "express";

const handleCookieParser = (router: Router) => {
  router.use(cookieParser());
};

const handleBodyParser = (router: Router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};

const handleCors = (router: Router) => {
  router.use(cors());
};

const handleCompression = (router: Router) => {
  router.use(compression());
};

export default [
  handleCookieParser,
  handleBodyParser,
  handleCors,
  handleCompression,
];
