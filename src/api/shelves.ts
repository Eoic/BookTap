import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { getManager } from "typeorm";
import { Shelf } from "../models/Shelf";
import { Topic } from "../models/Topic";
import { User } from "../models/User";
import { shelfLimits } from "../validation/limits";
import { validationResultParser } from "../validation/validationResultParser";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { verifyToken } from "./helpers/routeGuard";

const shelves = [
  /**
   * Get all shelves [LIST][DONE]
   */
  {
    path: "/shelves",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      entityManager.findOne(User, (req.user as any).id).then((result) => {
        entityManager.find(Shelf, {
          where: { user: result },
          relations: ["topic"],
        }).then((shelvesList) => {
          res.status(200).json({ shelves: shelvesList });
        });
      });
    },
  },

  /**
   * Get shelf by id (with books) [CRUD(get)]
   */
  {
    path: "/shelves/:id",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const shelfId: number = Number(req.params.id);

      if (isNaN(shelfId)) {
        res.sendStatus(400);
        return;
      }

      const user = await getManager().findOne(User, (req.user as any).id);
      const shelfBooks = await getManager().findOne(Shelf, {
        where: { id: shelfId, user },
        relations: ["books"],
      });

      if (shelfBooks && user) {
        const folder = `${user.id}-${user.username}`;

        shelfBooks.books.forEach((book: any) => {
          const extension = book.fsReference.substr(book.fsReference.length - 4);
          const image = book.fsReference.replace(extension, "-0.png");
          const filePath = path.join(__dirname, "../../", "uploads", folder, `${image}`);

          // Encode image
          const img = fs.readFileSync(filePath);
          const imgEncoded = Buffer.from(img).toString("base64");
          book.cover = imgEncoded;
        });

        res.status(200).json({ shelf: shelfBooks });
      } else {
        res.sendStatus(404);
      }
    },
  },

  /**
   * Create new shelf [CRUD(create)][DONE]
   */
  {
    path: "/shelves",
    method: METHOD_TYPE.POST,
    auth: verifyToken,
    validator: [
      check("title").not().isEmpty().withMessage("Shelf title should not be empty.")
        .isAlphanumeric().withMessage("Title should consist of alphanumeric characters only.")
        .isLength({ max: shelfLimits.title.max })
        .withMessage(`Title is too long. Max length is: ${shelfLimits.title.max}`),
    ],
    handler: async (req: Request, res: Response) => {
      // Check for validation errors
      const results = validationResult(req);

      if (!results.isEmpty()) {
        const errors = validationResultParser(results);
        res.status(400).json({ errors });
        return;
      }

      // Check if title is unique
      const { title, description } = req.body;
      const shelf = await getManager().findOne(Shelf, { title });

      if (shelf) {
        res.status(409).json({ errors: ["Shelf with this name already exists"] });
        return;
      }

      // Create shelf instance
      const user = await getManager().findOne(User, (req.user as any).id);
      const newShelf = getManager().create(Shelf, { title, user });

      if (typeof description !== "undefined") {
        newShelf.description = description;
      }

      newShelf.save().then((result) => {
        delete result.user;
        res.status(201).json({
          message: "Shelf was created successfully",
          content: result,
        });
        return;
      });
    },
  },

  /**
   * Assign topic to shelf [CRUD(modify)][DONE]
   */
  {
    path: "/shelves/:shelfId/topic/:topicId",
    method: METHOD_TYPE.PATCH,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const shelfId = Number(req.params.shelfId);
      const topicId = Number(req.params.topicId);

      const shelf = await entityManager.findOne(Shelf, { id: shelfId });

      if (!shelf) {
        res.status(404).json({ errors: ["Shelf not found"] });
        return;
      }

      const topic = await entityManager.findOne(Topic, { id: topicId });

      if (!topic) {
        res.status(404).json({ errors: ["Topic not found"] });
        return;
      }

      shelf.topic = topic;
      shelf.save().then(() => {
        res.sendStatus(204);
        return;
      });
    },
  },

  /**
   * Delete shelf [CRUD(remove)][DONE]
   */
  {
    path: "/shelves/:id",
    method: METHOD_TYPE.DELETE,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      getManager().delete(Shelf, { id }).then((result) => {
        if (result.affected === 0) {
          res.sendStatus(404);
          return;
        }
        res.sendStatus(204);
      });
    },
  },
];

export { shelves };
