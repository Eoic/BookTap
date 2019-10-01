import dotenv from "dotenv";
import path from "path";
if (process.env.NODE_ENV === "development") {
    const dotConfig = dotenv.config();
}
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { routes } from "./api/helpers/routeDistributor";
import { useMiddleware, useRoutes } from "./utilities/bootstrap";
import { connection } from "./utilities/database";
import middleware from "./utilities/middleware";

const router = express();
const port = process.env.PORT;

connection.then(() => {
    useMiddleware(middleware, router);
    useRoutes(routes, router);
    if (process.env.NODE_ENV === "production") {
        router.use(express.static("client/build"));
        router.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
        });
    }
}).then(() => {
    router.listen(port, () => console.log(`Server is running on port ${port}`));
}).catch((err) => {
    console.log(err);
});
