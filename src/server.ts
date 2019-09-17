import dotenv from "dotenv";
const dotConfig = dotenv.config();
import express from "express";
import "reflect-metadata";
import { routes } from "./api/helpers/routeDistributor";
import { useMiddleware, useRoutes } from "./utilities/bootstrap";
import { connection } from "./utilities/database";
import middleware from "./utilities/middleware";

const router = express();
const port = process.env.SERVER_PORT;

connection.then(() => {
    console.log("DB connection successful");
    useMiddleware(middleware, router);
    useRoutes(routes, router);
}).then(() => {
    router.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

console.log(process.env.NODE_ENV);
