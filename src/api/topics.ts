import { Request, Response } from "express";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { mockData } from "./helpers/mockData";

const topics = [
  /**
   * Get all topics [LIST]
   */
  {
    path: "/topics",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      res.status(200).json(mockData.topics);
    },
  },
  /**
   * Get shelf by id [CRUD(get)]
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
   * Create new topic [CRUD(create)]
   */
  {
    path: "/topics",
    method: METHOD_TYPE.POST,
    handler: async (req: Request, res: Response) => {
      const { title, description } = req.body;

      if (typeof title === "undefined" || typeof description === "undefined") {
        res.json(400);
        return;
      }

      res.sendStatus(204);
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
   * Remove topic by id [CRUD(remove)]
   */
  {
    path: "/topics/:id",
    method: METHOD_TYPE.DELETE,
    handler: async (req: Request, res: Response) => {
      const topic = mockData.topics[Number(req.params.id)];

      if (topic) {
        res.sendStatus(204);
        return;
      }

      res.sendStatus(404);
    },
  },
];

export { topics };
