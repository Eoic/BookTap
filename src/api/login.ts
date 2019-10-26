import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../models/User";
import { validationMessages } from "../validation/messages";
import { validationResultParser } from "../validation/validationResultParser";
import { METHOD_TYPE } from "./helpers/methodTypes";

const login = [{
    path: "/login",
    method: METHOD_TYPE.POST,
    validator: [
        check("username").trim()
            .not().isEmpty()
            .withMessage("Username is required"),
        check("password").not().isEmpty()
            .withMessage("Password is required"),
    ],
    handler: async (req: Request, res: Response) => {
        // Check for errors.
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: validationResultParser(result) });
            return;
        }

        // Search for user
        const { username, password } = req.body;
        const user = await getManager().findOne(User, { username });

        if (!user) {
            res.status(401).json({ errors: [validationMessages.INCORRECT_LOGIN_DETAILS] });
            return;
        }

        // Compare passwords and send signed token on match
        bcryptjs.compare(password, user.password, (err, isMatch) => {
            if (!isMatch || err) {
                res.status(401).json({ errors: [validationMessages.INCORRECT_LOGIN_DETAILS] });
                return;
            }

            const token = jwt.sign({
                id: user.id,
                username: user.username,
                userType: user.userType,
            }, String(process.env.JWT_SECRET), {
                expiresIn: String(process.env.JWT_VALID_FOR),
            });

            res.json({ token });
            return;
        });
    },
}];

export { login };
