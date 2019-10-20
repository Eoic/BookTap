import crypto from "crypto";
import epubParser from "epub-metadata-parser";
import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getManager } from "typeorm";
import { Book, BookStatus } from "../models/Book";
import { Shelf } from "../models/Shelf";
import { User } from "../models/User";
import { METHOD_TYPE } from "./helpers/methodTypes";
import { verifyToken } from "./helpers/routeGuard";

// Create storage for uploading files
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { id, username } = (req as any).user;
    const userDestination = `uploads/${id}-${username}`;
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
    const hash = crypto.createHash("md5").update(file.originalname).digest("hex");
    const extension = path.extname(file.originalname);
    callback(null, `${hash}${extension}`);
  },
});

// Create multer instance
const upload: multer.Instance = multer({ storage });

const books = [
  /**
   * Get all books [LIST][DONE]
   */
  {
    path: "/books",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const user = await getManager().findOne(User, (req.user as any).id);
      const bookList = await getManager().find(Book, { where: { user } });
      res.status(200).json(bookList);
    },
  },
  /**
   * Get book by id [CRUD(get)][DONE]
   */
  {
    path: "/books/:id",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      const book = await getManager().findOne(Book, id);

      if (typeof book === "undefined") {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(book);
    },
  },
  /**
   * Download book by id[][DONE]
   */
  {
    path: "/books/:id/download",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id = Number(req.params.id);
      const user = (req.user as any);

      // Find book reference in database
      const book = await getManager().findOne(Book, {
        where: { id },
        select: ["fsReference"],
      });

      // Check if file exists in the file system
      if (book) {
        const filePath = path.join(__dirname, "../../", "uploads",
                                   `${user.id}-${user.username}`,
                                   `${book.fsReference}`);
        fs.readFile(filePath, (err) => {
          if (err) {
            res.sendStatus(404);
            return;
          }

          // Send file
          res.sendFile(filePath, (error) => {
            if (error) {
              res.sendStatus(404);
              return;
            }
          });
        });
      }
    },
  },
  /**
   * Upload new book(s) [CRUD(create)][DONE]
   */
  {
    path: "/books/upload",
    method: METHOD_TYPE.POST,
    auth: verifyToken,
    upload: upload.any(),
    handler: async (req: Request, res: Response) => {
      if (req.files.length === 0) {
        res.sendStatus(400);
        return;
      }

      const file: Express.Multer.File = (req.files as any)[0];
      const extension = path.extname(file.originalname);

      if (extension === ".epub") {
        epubParser.parse(`${file.destination}/${file.filename}`, `${file.destination}/temp`, async (book: any) => {
          const entityManager = getManager();
          const user = await entityManager.findOne(User, { id: (req.user as any).id });
          const bookInstance = getManager().create(Book, {
            title: book.title._,
            author: book.author,
            status: BookStatus.NotStarted,
            description: book.description._,
            favourite: false,
            user,
            fsReference: book.fileName,
            publisher: book.publisher._,
            language: book.language,
            year: String(book.pubdate).substr(0, 4),
          });

          bookInstance.save().then((result) => {
            delete result.user;
            res.status(201).json({
              message: "Book was uploaded successfully.",
              content: result,
            });
          }).catch((error) => {
            res.sendStatus(400);
          });
        });
      }
    },
  },
  /**
   * Delete book by id [CRUD(delete)][DONE]
   */
  {
    path: "/books/:id",
    method: METHOD_TYPE.DELETE,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      getManager().delete(Book, { id }).then((result) => {
        if (result.affected === 0) {
          res.sendStatus(404);
          return;
        }
        res.status(200).json({
          message: "Book was deleted successfully.",
        });
      });
    },
  },
  /**
   * Add book to shelf [CRUD(modify)][DONE]
   */
  {
    path: "/books/:bookId/shelf/:shelfId",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const bookId = Number(req.query.params.bookId);
      const shelfId = Number(req.query.params.shelfId);
      const userId = (req.user as any).id;

      const user = await entityManager.findOne(User, userId);
      const book = await entityManager.findOne(Book, { where: { user, id: bookId } });

      if (book) {
        const shelf = await entityManager.findOne(Shelf, { where: { id: shelfId } });

        if (shelf) {
          book.shelf = shelf;
          res.sendStatus(204);
          return;
        } else {
          res.status(404).json({ errors: ["Shelf not found"] });
          return;
        }
      } else {
        res.status(404).json({ errors: ["Book not found"] });
        return;
      }
    },
  },
];

export { books };
