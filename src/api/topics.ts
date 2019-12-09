import { Request, Response } from "express";
import { check } from "express-validator";
import { getConnection, getManager } from "typeorm";
import { Shelf } from "../models/Shelf";
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
      res.status(200).json({ topics: topicList });
    },
  },

  /**
   * Get topic by id [CRUD(get)][DONE]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const topicId = Number(req.params.id);
      const entityManager = getManager();
      const user = await entityManager.findOne(User, (req.user as any).id);

      const shelf = await entityManager.findOne(Topic, {
        where: { user, id: topicId },
      });

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

      newTopic.save().then(() => {
        res.sendStatus(201);
        return;
      });
    },
  },

  /**
   * Update topic by id [CRUD(update)][DONE]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const topicId = Number(req.params.id);
      const user = await entityManager.findOne(User, (req.user as any).id);
      const { title, description } = req.body;

      const topic = await entityManager.findOne(Topic, {
        where: { user, id: topicId },
      });

      if (topic) {
        if (typeof title !== "undefined") {
          topic.title = title;
        }

        if (typeof description !== "undefined") {
          topic.description = description;
        }

        topic.save().then(() => {
          res.sendStatus(204);
          return;
        });
      } else {
        res.sendStatus(404);
      }
    },
  },

  {
    path: "/topics/:id/shelves",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const topicId = Number(req.params.id);
      const user = await entityManager.findOne(User, (req.user as any).id);

      const topic = await entityManager.findOne(Topic, {
        where: { user, id: topicId },
      });

      if (topic) {
        const shelvesList: number[] = req.body.shelves;

        for (let i = 0; i < shelvesList.length; i++) {
          shelvesList[i] = Number(shelvesList[i]);
        }

        await entityManager.update(Shelf, { user, topic }, { topic: null });

        if (shelvesList.length > 0) {
          await getConnection().createQueryBuilder()
            .update(Shelf)
            .set({ topic })
            .where("id IN (:...shelves)", { shelves: shelvesList })
            .execute();
        }

        res.sendStatus(200);
        return;
      }

      res.sendStatus(404);
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
