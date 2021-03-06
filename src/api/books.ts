import crypto from "crypto";
import exiftoolBin from "dist-exiftool";
import epubParser from "epub-metadata-parser";
import { Request, Response, response } from "express";
import fs from "fs";
import multer from "multer";
import exiftool from "node-exiftool";
import path from "path";
import pdfImage from "pdf-image";
import { getManager } from "typeorm";
import { Book, BookStatus } from "../models/Book";
import { Shelf } from "../models/Shelf";
import { Topic } from "../models/Topic";
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
    const hash = crypto.createHash("md5").update(file.originalname + new Date().toISOString()).digest("hex");
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
      const bookList = await getManager().find(Book, {
        where: { user },
        relations: ["shelf"],
        order: {
          title: "ASC",
        },
      });

      if (user) {
        const folder = `${user.id}-${user.username}`;

        bookList.forEach((book: any) => {
          const extension = book.fsReference.substr(book.fsReference.length - 4);
          const image = book.fsReference.replace(extension, "-0.png");
          const filePath = path.join(__dirname, "../../", "uploads", folder, `${image}`);

          // Encode image
          const img = fs.readFileSync(filePath);
          const imgEncoded = Buffer.from(img).toString("base64");
          book.cover = imgEncoded;
        });
      }

      res.status(200).json(bookList);
    },
  },

  {
    path: "/books/summary",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const user = await getManager().findOne(User, (req.user as any).id);

      if (user) {
        const bookStatusList = await getManager().find(Book, {
          where: { user },
          select: ["status"],
        });

        const inProgress = bookStatusList.filter((book) => Number(book.status) === 1).length;
        const done = bookStatusList.filter((book) => Number(book.status) === 2).length;
        const shelves = await getManager().count(Shelf, { where: { user } });
        const topics = await getManager().count(Topic, { where: { user } });
        res.json({ uploaded: bookStatusList.length, inProgress, done, shelves, topics });
        return;
      } else {
        res.sendStatus(403);
      }
    },
  },

  {
    path: "/books/unshelved",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const user = await getManager().findOne(User, (req.user as any).id);
      const bookList = await getManager().find(Book, {
        where: { user, shelf: null },
      });

      if (user) {
        const folder = `${user.id}-${user.username}`;

        bookList.forEach((book: any) => {
          const extension = book.fsReference.substr(book.fsReference.length - 4);
          const image = book.fsReference.replace(extension, "-0.png");
          const filePath = path.join(__dirname, "../../", "uploads", folder, `${image}`);

          // Encode image
          const img = fs.readFileSync(filePath);
          const imgEncoded = Buffer.from(img).toString("base64");
          book.cover = imgEncoded;
        });

        res.status(200).json(bookList);
        return;
      }

      res.sendStatus(403);
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

      const user = await getManager().findOne(User, (req.user as any).id);
      const book = await getManager().findOne(Book, id, { where: { user } });

      if (typeof book === "undefined") {
        res.sendStatus(404);
        return;
      }

      if (user) {
        const folder = `${user.id}-${user.username}`;
        const extension = book.fsReference.substr(book.fsReference.length - 4);
        const image = book.fsReference.replace(extension, "-0.png");
        const filePath = path.join(__dirname, "../../", "uploads", folder, `${image}`);

        // Encode image
        const img = fs.readFileSync(filePath);
        const imgEncoded = Buffer.from(img).toString("base64");
        (book as any).cover = imgEncoded;
        res.status(200).json(book);
        return;
      }

      res.sendStatus(403);
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
        const folder = `${user.id}-${user.username}`;
        const filePath = path.join(__dirname, "../../", "uploads", folder, `${book.fsReference}`);

        fs.readFile(filePath, (err) => {
          if (err) {
            res.sendStatus(404);
            return;
          }

          const stat = fs.statSync(filePath);

          // Send file
          response.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename = ${book.originalFilename}`,
          });

          const readableStream = fs.createReadStream(filePath);
          readableStream.pipe(res);
        });
      } else {
        res.sendStatus(404);
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

      const entityManager = getManager();
      const user = await entityManager.findOne(User, { id: (req.user as any).id });
      const file: Express.Multer.File = (req.files as any)[0];
      const extension = path.extname(file.originalname);

      if (extension === ".epub") {
        epubParser.parse(`${file.destination}/${file.filename}`, `${file.destination}/temp`, async (book: any) => {
          const bookInstance = getManager().create(Book, {
            title: String(book.title),
            author: String(book.author),
            status: BookStatus.NotStarted,
            description: (book.description) ? book.description._ : "",
            favourite: false,
            originalFilename: file.originalname,
            user,
            fsReference: book.fileName,
            publisher: String(book.publisher),
            language: String(book.language),
            year: String(book.pubdate).substr(0, 4),
          });

          bookInstance.save().then((result) => {
            res.status(201).json({
              message: "Book was uploaded successfully.",
            });
          }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
        });
      } else if (extension === ".pdf") {
        const ep = new exiftool.ExiftoolProcess(exiftoolBin);
        const pathToFile = `${file.destination}/${file.filename}`;
        const img = new pdfImage.PDFImage(pathToFile);

        img.convertPage(0).then((imgPath: any) => {
          ep
            .open()
            .then(() => ep.readMetadata(pathToFile, ["-File:all"]))
            .then((result: any, error: any) => {

              if (error) {
                res.sendStatus(400);
                return;
              }

              console.log(result);

              const bookInstance = getManager().create(Book, {
                title: result.data[0].Title || "Unnamed",
                author: result.data[0].Author || "Unnamed author",
                status: BookStatus.NotStarted,
                description: "",
                favourite: false,
                user,
                fsReference: file.filename,
                originalFilename: file.originalname,
                publisher: "",
                language: "EN",
                year: String(result.data[0].CreateDate).substr(0, 4),
              });

              bookInstance.save().then(() => {
                res.status(201).json({
                  message: "Book was uploaded successfully.",
                });
              }).catch((err: any) => {
                console.log(err);
                res.sendStatus(400);
              });
            })
            .then(() => ep.close())
            .catch((err: any) => {
              console.log(err);
            });
        });
      }
    },
  },

  /**
   * Get book cover
   */
  {
    path: "/books/:id/cover",
    method: METHOD_TYPE.GET,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);
      const user = await getManager().findOne(User, { id: (req.user as any).id });

      if (!user) {
        res.sendStatus(400);
        return;
      }

      const book = await getManager().findOne(Book, {
        where: { id, user },
        select: ["fsReference"],
      });

      if (!book) {
        res.sendStatus(404);
        return;
      } else {
        const imgEncoded = "";
        res.status(200).json({ image: imgEncoded });
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
      const manager = getManager();

      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }

      const user = await getManager().findOne(User, { id: (req.user as any).id });
      const book = await getManager().findOne(Book, {
        where: { id },
        select: ["fsReference"],
      });

      if (!book) {
        console.log("BOOK NOT FOUND");
        res.sendStatus(404);
        return;
      } else {
        const b = await getManager().findOne(Book, {
          where: { id, user },
          select: ["fsReference"],
        });

        if (!b) {
          res.sendStatus(403);
          return;
        }
      }

      getManager().delete(Book, { id }).then((result) => {
        const bookPath = path.join(__dirname, "../../", "uploads", `${user!.id}-${user!.username}`, `${book!.fsReference}`);
        fs.unlinkSync(bookPath);

        if (result.affected === 0) {
          console.log("FAILED TO DELETE");
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
   * Edit book metadata [CRUD(modify)][DONE]
   */
  {
    path: "/books/:id",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const bookId = Number(req.params.id);
      const userId = (req.user as any).id;
      const user = await entityManager.findOne(User, userId);
      const book = await entityManager.findOne(Book, { where: { user, id: bookId } });
      const { title, description, author, publisher, language, year } = req.body;

      if (book) {
        if (title) {
          if (title.trim() !== "") {
            book.title = title;
          }
        }

        book.description = description;
        book.author = author;
        book.publisher = publisher;
        book.language = language;
        book.year = year;

        book.save().then(() => {
          res.sendStatus(204);
          return;
        }).catch(() => {
          res.sendStatus(400);
          return;
        });
      } else {
        res.sendStatus(404);
      }
    },
  },

  /*
   * Set book status
   */
  {
    path: "/books/:id/status",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const bookId = Number(req.params.id);
      const user = await entityManager.findOne(User, (req.user as any).id);
      const book = await entityManager.findOne(Book, { where: { user, id: bookId } });
      const { status } = req.body;

      if (book) {
        if (status) {
          if (typeof BookStatus[status] !== "undefined") {
            const enumKey: string = BookStatus[status];
            book.status = BookStatus[enumKey as any] as any;

            book.save().then(() => {
              res.sendStatus(200);
              return;
            }).catch(() => {
              res.sendStatus(400);
              return;
            });
          } else {
            res.sendStatus(400);
            return;
          }
        }
      } else {
        res.sendStatus(404);
      }
    },
  },

  /**
   * Toggle book as favourite
   */
  {
    path: "/books/:id/favourite",
    method: METHOD_TYPE.PATCH,
    auth: verifyToken,
    handler: async (req: Request, res: Response) => {
      const entityManager = getManager();
      const bookId = Number(req.params.id);
      const user = await entityManager.findOne(User, (req.user as any).id);
      const book = await entityManager.findOne(Book, { where: { user, id: bookId } });

      if (book) {
        const favourite = Number(req.body.favourite);

        if (!isNaN(favourite)) {
          if (favourite === 0) {
            book.favourite = false;
          } else if (favourite === 1) {
            book.favourite = true;
          } else {
            res.sendStatus(400);
            return;
          }

          book.save().then(() => {
            res.sendStatus(204);
            return;
          });
        }
      } else {
        res.sendStatus(404);
        return;
      }
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
      const bookId = Number(req.params.bookId);
      const shelfId = Number(req.params.shelfId);
      const userId = (req.user as any).id;
      const user = await entityManager.findOne(User, userId);
      const book = await entityManager.findOne(Book, { where: { user, id: bookId } });

      if (book) {
        if (shelfId === -1) {
          await entityManager.update(Book, { user, id: bookId }, { shelf: null });
          res.sendStatus(204);
          return;
        }

        const shelf = await entityManager.findOne(Shelf, { where: { id: shelfId } });

        if (shelf) {
          book.shelf = shelf;
          book.save().then(() => {
            res.sendStatus(204);
          }).catch(() => {
            res.sendStatus(400);
          });
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
