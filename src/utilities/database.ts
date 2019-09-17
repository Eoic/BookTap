import { createConnection } from "typeorm";
import { User } from "../models/User";

export const connection = createConnection({
  database:     process.env.DB_NAME,
  entities:     [User],
  host:         process.env.DB_HOST,
  password:     process.env.DB_PASS,
  port:         Number(process.env.DB_PORT),
  synchronize:  true,
  type:         "postgres",
  username:     process.env.DB_USER,
});
