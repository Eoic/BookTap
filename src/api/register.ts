import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getManager } from "typeorm";
import { User, UserType } from "../models/User";
import { validationLimits } from "../validation/limits";
import { validationMessages  } from "../validation/messages";
import { validationResultParser } from "../validation/validationResultParser";
import { METHOD_TYPE } from "./helpers/methodTypes";

const register = [{
  path: "/register",
  method: METHOD_TYPE.POST,
  validator: [
    check("username").trim()
                     .escape()
                     .isAlphanumeric()
                     .withMessage(validationMessages.ALPHANUMERIC_ONLY)
                     .isLength({ min: validationLimits.USERNAME.min, max: validationLimits.USERNAME.max })
                     .withMessage(validationMessages.USERNAME_LENGTH_INVALID),
    check("password").isLength({ min: validationLimits.PASSWORD.min, max: validationLimits.PASSWORD.max })
                     .withMessage(validationMessages.PASSWORD_LENGTH_INVALID),
    check("email").isEmail()
                  .withMessage(validationMessages.NOT_AN_EMAIL)
                  .normalizeEmail()
                  .not().isEmpty()
                  .isLength({ max: validationLimits.EMAIL.max })
                  .withMessage(validationMessages.EMAIL_TOO_LONG),
    body("email").custom(async (email) => {
      const user = await getManager().findOne(User, { email });

      if (user) {
        return Promise.reject(validationMessages.EMAIL_TAKEN);
      }
    }),
    body("username").custom(async (username) => {
      const user = await getManager().findOne(User, { username });

      if (user) {
        return Promise.reject(validationMessages.USERNAME_TAKEN);
      }
    }),
    body("passwordRepeat").custom((passwordRepeat, { req }) => {
      if (passwordRepeat !== req.body.password) {
        return Promise.reject(validationMessages.PASSWORD_FAILED_MATCH);
      }

      return true;
    }),
  ],
  handler: async (req: Request, res: Response) => {
    const errors = validationResult(req);

    // If any validation errors ocurred.
    if (!errors.isEmpty()) {
      console.log(errors);
      res.status(400).json({ errors: validationResultParser(errors) });
      return;
    }

    // Create new user
    const { username, password, email } = req.body;
    const entityManager = getManager();

    bcryptjs.hash(password, Number(process.env.SALT_ROUNDS), async (err, hash) => {
      if (err) {
        console.error(err);
        return;
      }

      const user = entityManager.create(User, {
        email,
        username,
        userType: UserType.Client,
        password: hash,
      });

      entityManager.save(user).then((result) => {
        const token = jwt.sign({
          id: result.id,
          username: result.username,
          userType: result.userType,
          email: result.email,
        }, String(process.env.JWT_SECRET), {
          expiresIn: String(process.env.JWT_VALID_FOR),
        });

        res.status(201).json({ token });
      }).catch((error) => {
        res.sendStatus(500);
      });
    });
  },
}];

export { register };
