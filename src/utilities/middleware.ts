import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Router, static as staticPath } from "express";
import passport, { Profile } from "passport";
import PassportStrategy from "passport-google-oauth20";
import path from "path";
import { getManager } from "typeorm";
import { User, UserType } from "../models/User";
import { getSessionInstance } from "./middleware-instances";

const handleCookieParser = (router: Router) => {
  router.use(cookieParser());
};

const handleBodyParser = (router: Router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};

const handleCors = (router: Router) => {
  router.use(cors({ credentials: true, origin: true }));
};

const handleCompression = (router: Router) => {
  router.use(compression());
};

const handleSessionParser = (router: Router) => {
  router.use(getSessionInstance());
};

const handleStaticPath = (router: Router) => {
  router.use(staticPath(path.resolve(__dirname, "public")));
};

const handleAuthStrategy = (router: Router) => {
  const entityManager = getManager();

  passport.use(new PassportStrategy.Strategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: `/auth/google/callback`,
  }, async (accessToken: string, refreshToken: string, profile: Profile, callback: PassportStrategy.VerifyCallback) => {
    // console.log("Callback...");
  }));
};

const serveClientFiles = (router: Router) => {
  if (process.env.NODE_ENV === "production") {
    router.use(express.static("client/build"));
    router.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
};

export default [
  handleCookieParser,
  handleBodyParser,
  handleCors,
  handleCompression,
  handleSessionParser,
  handleStaticPath,
  handleAuthStrategy,
  // serveClientFiles,
];
