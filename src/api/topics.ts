import { Request, Response } from "express";
import { check } from "express-validator";
import { getManager } from "typeorm";
import { Topic } from "../models/Topic";
import { User } from "../models/User";
import { topicLimits } from "../validation/limits";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { mockData } from "./helpers/mockData";
import { verifyToken } from "./helpers/routeGuard";

const topics = [
  /**
   * Get all topics [LIST][DONE]
   */
  {
    path: "/topics",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const user = await getManager().findOne(User, (req.user as any).id);
      const topicList = await getManager().find(Topic, { where: { user } });
      res.status(200).json(topicList);
    },
  },
  /**
   * Get topic by id [CRUD(get)]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      const shelf = mockData.shelves[Number(req.params.id)];

      if (shelf) {
        res.status(200).json(shelf);
        return;
      }

      res.sendStatus(404);
    },
  },
  /**
   * Create new topic [CRUD(create)][DONE]
   */
  {
    path: "/topics",
    method: METHOD_TYPE.POST,
    validator: [
      check("title").trim().not().isEmpty()
                    .withMessage("Topic title should not be empty")
                    .isLength({ max: topicLimits.title.max })
                    .withMessage(`Topic title is too long. Shoud be no more than ${topicLimits.title.max} characters`)
                    .isAlphanumeric().withMessage("Title should consist of alphanumeric characters only"),
      check("description").trim()
                    .isLength({ max: topicLimits.description.max })
                    .withMessage(`Topic description should be no more than ${topicLimits.description.max} characters`),
    ],
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const { title, description } = req.body;
      const entityManager = getManager();

      // Check for duplicate first
      const user = await entityManager.findOne(User, (req.user as any).id);
      const topic = await entityManager.findOne(Topic, {
        where: { user, title },
      });

      if (topic) {
        res.status(409).json({ errors: ["Topic with such name already exists."] });
        return;
      }

      // Create new topic
      const newTopic = entityManager.create(Topic, {
        title,
        description,
        user,
      });

      newTopic.save().then((result) => {
        delete result.user;
        res.status(201).json({ topic: result });
        return;
      });
    },
  },
  /**
   * Update topic by id [CRUD(update)]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.PUT,
    handler: async (req: Request, res: Response) => {
      const { title, description } = req.body;

      if (typeof title === "undefined" || typeof description === "undefined") {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(204);
    },
  },
  /**
   * Remove topic by id [CRUD(remove)][DONE]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.DELETE,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id = Number(req.params.id);
      const user = await getManager().findOne(User, (req.user as any).id);

      getManager().delete(Topic, { id, user }).then((result) => {
        if (result.affected === 0) {
          res.sendStatus(404);
          return;
        }

        res.sendStatus(204);
      });
    },
  },
];

export { topics };
