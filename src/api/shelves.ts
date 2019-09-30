import { Request, Response } from "express";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { mockData } from "./helpers/mockData";

const shelves = [
  /**
   * Get all shelves [LIST]
   */
  {
    path: "/shelves",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      res.status(200).json(mockData.shelves);
    },
  },
  /**
   * Get shelf by id (with books) [CRUD(get)]
   */
  {
    path: "/shelves/:id",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      const books = mockData.books.filter((book) => book.shelf === id);
      const shelf = mockData.shelves.filter((shelfObj) => shelfObj.id === id);
      const data = { shelf, books };

      if (data.shelf.length === 0) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(data);
    },
  },
  /**
   * Create new shelf [CRUD(create)]
   */
  {
    path: "/shelves",
    method: METHOD_TYPE.POST,
    handler: async (req: Request, res: Response) => {
      console.log(req.body);
      const { title, description } = req.body;

      if (typeof title === "undefined" || typeof description === "undefined") {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(204);
    },
  },
  /**
   * Assign topic to shelf [CRUD(modify)]
   */
  {
    path: "/shelves/:shelfId/topic/:topicId",
    method: METHOD_TYPE.PATCH,
    handler: async (req: Request, res: Response) => {
      res.sendStatus(204);
    },
  },
  /**
   * Get shelves by topic
   */
  {
    path: "/shelves/topic/:topicId",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      const topicId: number = Number(req.params.topicId);
      const filteredShelves = mockData.shelves.filter((shelf) => shelf.topic === topicId);
      const data: any = [];

      filteredShelves.forEach((shelf) => {
        const shelfBooks = mockData.books.filter((bookObj) => bookObj.shelf === shelf.id);
        data.push({
          shelf,
          shelfBooks,
        });
      });

      if (data.length === 0) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(data);
    },
  },
  /**
   * Delete shelf [CRUD(remove)]
   */
  {
    path: "/shelves/:id",
    method: METHOD_TYPE.DELETE,
    handler: async (req: Request, res: Response) => {
      const shelfId: number = Number(req.params.id);
      const shelf = mockData.shelves.filter((shelfObj) => shelfObj.id === shelfId)[0];

      if (shelf) {
        res.sendStatus(204);
        return;
      }

      res.sendStatus(404);
    },
  },
];

export { shelves };
