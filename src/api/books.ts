import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { mockData } from "./helpers/mockData";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const userDestination = `uploads/${1}`;
    let stat = null;

    try {
      stat = fs.statSync(userDestination);
    } catch (err) {
      fs.mkdirSync(userDestination);
    }

    if (stat && !stat.isDirectory()) {
      throw new Error("Cound not create directory.");
    }

    callback(null, userDestination);
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

const upload: multer.Instance = multer({ storage });

const books = [
  /**
   * Get all books [LIST]
   */
  {
    path: "/books",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      res.status(200).json(mockData.books);
    },
  },
  /**
   * Get book by id [CRUD(get)]
   */
  {
    path: "/books/:id",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      const book = mockData.books[id];

      if (typeof book === "undefined") {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(book);
    },
  },
  /**
   * Download book by id
   */
  {
    path: "/books/:id/download",
    method: METHOD_TYPE.GET,
    handler: async (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../uploads/example-book.pdf"));
    },
  },
  /**
   * Upload new book(s) [CRUD(create)]
   */
  {
    path: "/books/upload",
    method: METHOD_TYPE.POST,
    upload: upload.any(),
    handler: async (req: Request, res: Response) => {
      if (req.files.length === 0) {
        res.sendStatus(400);
        return;
      }

      res.status(200).json({
        message: "Book was uploaded successfully.",
      });
    },
  },
  /**
   * Delete book by id [CRUD(delete)]
   */
  {
    path: "/books/:id",
    method: METHOD_TYPE.DELETE,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      const book = mockData.books[id];

      if (typeof book === "undefined") {
        res.sendStatus(404);
        return;
      }

      res.status(200).json({
        message: "Book was deleted successfully.",
      });
    },
  },
  /**
   * Add book to shelf [CRUD(modify)]
   */
  {
    path: "/books/:id/assign-shelf",
    method: METHOD_TYPE.PATCH,
    handler: async (req: Request, res: Response) => {
      const filteredBook = mockData.books.filter((book) => book.id === Number(req.params.id))[0];

      if (filteredBook) {
        res.sendStatus(204);
        return;
      }

      res.sendStatus(404);
    },
  },
];

export { books };
