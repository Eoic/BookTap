import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import { User, UserType } from "../models/User";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { mockData } from "./helpers/mockData";

const users = [
    /**
     * Get all users
     */
    {
        path: "/users",
        method: METHOD_TYPE.GET,
        handler: async (req: Request, res: Response) => {
            const entityManager = getManager();
            await entityManager.delete(User, {
                username: "hello",
            });

            const result = await entityManager.find(User, {
                username: "hello",
            });
            res.status(200).json(result);
        },
    },
    /**
     * Get user by id
     */
    {
        path: "/users/:id",
        method: METHOD_TYPE.GET,
        handler: async (req: Request, res: Response) => {
            const id: number = Number(req.params.id);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const userObj = mockData.users[id];

            if (typeof userObj === "undefined") {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(userObj);
        },
    },
    /**
     * Create new user
     */
    {
        path: "/users",
        method: METHOD_TYPE.POST,
        handler: async (req: Request, res: Response) => {
            res.sendStatus(201);
        },
    },
    /**
     * Edit user
     */
    {
        path: "/users/:id",
        method: METHOD_TYPE.PATCH,
        handler: async (req: Request, res: Response) => {
            const id: number = Number(req.params.id);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const userObj = mockData.users[id];

            if (typeof userObj === "undefined") {
                res.sendStatus(404);
                return;
            }

            console.log(userObj);
            res.sendStatus(204);
        },
    },
    /**
     * Delete user
     */
    {
        path: "/users/:id",
        method: METHOD_TYPE.DELETE,
        handler: async (req: Request, res: Response) => {
            const id: number = Number(req.params.id);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const userObj = mockData.users[id];

            if (typeof userObj === "undefined") {
                res.sendStatus(404);
                return;
            }

            res.sendStatus(204);
        },
    },
];

export { users };
