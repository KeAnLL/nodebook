const express = require("express");
const { authenticateJWT } = require("../../users/auth/middleware/auth.js");
const book = express.Router();
const category = express.Router();
const multer = require("multer");

const BookController = require("./controllers/book.controller.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/book-images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("file");

book.post("/create", authenticateJWT, BookController.createBook);

book.patch("/update", authenticateJWT, BookController.updateBook);

book.delete("/delete/:book", authenticateJWT, BookController.deleteBook);

book.get("/", BookController.findAllBooks);

book.get("/query", BookController.getBookInfo);

book.get("/query/id", BookController.findBookById);

book.get("/query/cat", BookController.findBookByCategories);

book.post("/:book/addcategory", BookController.addCategoryToBook);

book.delete("/:book/deletecategory", BookController.removeCategoryFromBook);

book.post("/:book/addauthor", BookController.addAuthorToBook);

book.delete("/:book/deleteauthor", BookController.removeAuthorFromBook);

book.post("/:book/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

// book.get("/:bookId/image");

book.get("/test", (req, res) => {
  res.sendStatus(200);
});

book.get("/testauth", (req, res) => {
  res.sendStatus(200);
});

book.get("/category", BookController.findAllCategories);

book.get("/author", BookController.findAllAuthors);

module.exports = book;
