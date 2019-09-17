import express from "express";
import { routes } from "./api/helpers/routeDistributor";
import { useMiddleware, useRoutes } from "./utilities/bootstrap";
import { connection } from "./utilities/database";
import middleware from "./utilities/middleware";

const router = express();

connection.then(() => {
    console.log("DB connection successful");
    useMiddleware(middleware, router);
    useRoutes(routes, router);
}).then(() => {
    router.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
