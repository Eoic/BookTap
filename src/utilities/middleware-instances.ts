/*
import connectRedis from "connect-redis";
import expressSession, { MemoryStore } from "express-session";
import redis from "redis";
import { SessionType } from "./types";

const createStore = (sessionInstance: SessionType) => {
  if (process.env.NODE_ENV === "production") {
    const redisStore = connectRedis(sessionInstance);
    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });
    return new redisStore({ client: redisClient });
  }

  return new MemoryStore();
};

const session = expressSession({
  cookie: {
    maxAge: 1209600000,
    sameSite: true,
    secure: (process.env.NODE_ENV === "production"),
  },
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: String(process.env.SESSION_SECRET),
  store: createStore(expressSession),
});

const getSessionInstance = () => session;
export { getSessionInstance };
*/

import expressJwt from "express-jwt";

const expressJwtInstance = expressJwt({
  secret: String(process.env.JWT_SECRET),
});

export const getTokenParser = () => expressJwtInstance;
