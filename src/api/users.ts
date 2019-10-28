import crypto from "crypto";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User, UserType } from "../models/User";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { verifyToken } from "./helpers/routeGuard";

const users = [
    /**
     * Get all users [DONE]
     */
    {
        path: "/users",
        method: METHOD_TYPE.GET,
        auth: verifyToken,
        handler: async (req: Request, res: Response) => {
            const user = req.user as any;

            if (user.userType !== UserType.Admin) {
                res.sendStatus(403);
                return;
            }

            const userList = await getManager().find(User, { select: ["id", "username", "email", "createdAt", "updatedAt"] });
            res.status(200).json(userList);
        },
    },

    /**
     * Get user by id [DONE]
     */
    {
        path: "/users/:id",
        method: METHOD_TYPE.GET,
        auth: verifyToken,
        handler: async (req: Request, res: Response) => {
            const user = req.user as any;

            if (user.userType !== UserType.Admin) {
                res.sendStatus(403);
                return;
            }

            const id: number = Number(req.params.id);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const userObj = await getManager().findOne(User, id);

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
        auth: verifyToken,
        handler: async (req: Request, res: Response) => {
            const user = req.user as any;

            if (user.userType !== UserType.Admin) {
                res.sendStatus(403);
                return;
            }

            // TODO: validate and create

            res.sendStatus(201);
        },
    },

    /**
     * Delete user [DONE]
     */
    {
        path: "/users/:id",
        method: METHOD_TYPE.DELETE,
        auth: verifyToken,
        handler: async (req: Request, res: Response) => {
            const user = req.user as any;

            if (user.userType !== UserType.Admin) {
                res.sendStatus(403);
                return;
            }

            const id: number = Number(req.params.id);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            getManager().delete(User, { id }).then((result) => {
                if (result.affected !== 0) {
                    res.sendStatus(204);
                } else {
                    res.sendStatus(404);
                }
            });
        },
    },
];

export { users };
