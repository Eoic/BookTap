import { TlsOptions } from "tls";
import { createConnection } from "typeorm";
import { Book } from "../models/Book";
import { Shelf } from "../models/Shelf";
import { Topic } from "../models/Topic";
import { User } from "../models/User";

function decodeBase64(value: string | undefined): string {
  return new Buffer(String(value), "base64").toString("ascii");
}

function getTlsOptions(): TlsOptions | boolean {
  if (process.env.NODE_ENV === "production") {
    return {
      ca: decodeBase64(process.env.SERVER_CA),
      cert: decodeBase64(process.env.CLIENT_CERT),
      key: decodeBase64(process.env.CLIENT_KEY),
      rejectUnauthorized: false,
    };
  }
  return false;
}

export const connection = createConnection({
  database: process.env.DB_NAME,
  entities: [User, Shelf, Topic, Book],
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
  ssl: getTlsOptions(),
  synchronize: true,
  type: "postgres",
  username: process.env.DB_USER,
});
