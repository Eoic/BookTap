import { TlsOptions } from "tls";
import { createConnection } from "typeorm";
import { User } from "../models/User";

function getTlsOptions(): TlsOptions | boolean {
  if (process.env.NODE_ENV === "production") {
    return {
      ca: new Buffer(String(process.env.SERVER_CA), "base64").toString("ascii"),
      cert: new Buffer(String(process.env.CLIENT_CERT), "base64").toString("ascii"),
      key: new Buffer(String(process.env.CLIENT_KEY), "base64").toString("ascii"),
      rejectUnauthorized: false,
    };
  }
  return false;
}

export const connection = createConnection({
  database: process.env.DB_NAME,
  entities: [User],
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
  ssl: getTlsOptions(),
  synchronize: true,
  type: "postgres",
  username: process.env.DB_USER,
});
