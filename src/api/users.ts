import { Request, Response, response } from "express";
import { getConnection, getManager } from "typeorm";
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

            if (user) {

                // tslint:disable-next-line: max-line-length
                const userList = await getConnection().getRepository(User)
                    .createQueryBuilder()
                    .select(["id", "username", "email", "\"userType\"", "\"createdAt\"", "\"updatedAt\""])
                    .where("id <> :id", { id: user.id })
                    .orderBy("username", "ASC")
                    .execute();

                res.status(200).json(userList);
                return;
            }

            res.sendStatus(403);
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
     * Create new user
     */
    {
        path: "/users/:id/role",
        method: METHOD_TYPE.PATCH,
        auth: verifyToken,
        handler: async (req: Request, res: Response) => {
            const user = req.user as any;

            if (user.userType !== UserType.Admin) {
                res.sendStatus(403);
                return;
            }

            const newType = Number(req.body.userType);

            if (newType === 0 || newType === 1) {
                getManager().update(User, { id: Number(req.params.id) }, { userType: newType }).then(() => {
                    res.sendStatus(204);
                });
            } else {
                res.sendStatus(400);
            }
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
