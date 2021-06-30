const BookModel = require("../models/book.model");
const { handleSqlError } = require("../../../utils/database.func.js");

const _errHandler = (err, res, action) => {
  let errMsg = handleSqlError(err);
  console.error(errMsg);
  return res.status(400).json({
    msg: `Oops! Something went wrong when ${action}`,
    err: errMsg,
  });
};

exports.createBook = (req, res) => {
  BookModel.createBook(req.body)
    .then(([result, fields]) => {
      if (result.affectedRows == 1) {
        console.log(`Book #${result.insertId} created`);
        res.status(200).json({
          msg: "Book created",
        });
      } else {
        res.status(400).json({
          msg: "Fail when creating book",
        });
      }
    })
    .catch((err) => {
      _errHandler(err, res, "creating book");
    });
};

exports.updateBook = (req, res) => {
  BookModel.updateBook(req.body)
    .then(([result, fields]) => {
      if (result.affectedRows <= 1) {
        let exist = result.affectedRows != 0;
        res.status(200).json({
          exist: exist,
          msg: exist
            ? `Book(id: ${bookId}) is successfully updated`
            : "Book not found",
        });
      } else {
        throw Error("Issue occurs internally | DEBUG needed");
      }
    })
    .catch((err) => {
      _errHandler(err, res, "updating book");
    });
};

exports.deleteBook = (req, res) => {
  const bookId = req.params.book;
  BookModel.deleteBook(bookId)
    .then(([result, fields]) => {
      if (result.affectedRows <= 1) {
        let exist = result.affectedRows != 0;
        res.status(200).json({
          exist: exist,
          msg: exist
            ? `Book(id: ${bookId}) is successfully deleted`
            : "Book not found",
        });
      } else {
        throw Error("Issue occurs internally | DEBUG needed");
      }
    })
    .catch((err) => {
      _errHandler(err, res, "deleting book");
    });
};

exports.getBookInfo = (req, res) => {
  const bookId = req.query.book;
  BookModel.queryBookById(bookId)
    .then(async ([rows, fields]) => {
      if (rows.length > 0) {
        const bookInfo = rows[0];
        await BookModel.queryCategoryByBook(bookId)
          .then(([rows, fields]) => {
            bookInfo.category = rows;
          })
          .catch((err) => {
            _errHandler(err, res, "querying category for book");
          });

        await BookModel.queryAuthorByBook(bookId)
          .then(([rows, fields]) => {
            bookInfo.author = rows;
          })
          .catch((err) => {
            _errHandler(err, res, "querying author for book");
          });

        res.status(200).json(bookInfo);
      } else {
        // TODO
      }
    })
    .catch((err) => {
      _errHandler(err, res, "getting the info of book");
    });
};

exports.findAllBooks = (req, res) => {
  BookModel.queryAllBooks()
    .then(([rows, fields]) => {
      // console.log(rows);
      res.status(200).json(rows);
    })
    .catch((err) => {
      _errHandler(err, res, "querying for book");
    });
};

exports.findBookById = (req, res) => {
  const bookId = req.query.bookId;
  BookModel.queryBookById(bookId)
    .then(([rows, fields]) => {
      if (rows.length > 1) {
        throw Error("Issue occurs internally | DEBUG needed");
      } else {
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      _errHandler(err, res, "creating profile");
    });
};

exports.findBookByCategories = (req, res) => {
  const categoryList = req.body.categoryList;
  BookModel.queryBookByCategories(categoryList)
    .then(([rows, fields]) => {
      res.status(200).json({
        result: rows,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.findAllCategories = (req, res) => {
  BookModel.queryAllCategories()
    .then(([rows, fields]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      _errHandler(err, res, "fetching all categories");
    });
};

exports.addCategoryToBook = (req, res) => {
  const body = {
    bookId: parseInt(req.params.book),
    category: req.body.category,
  };

  BookModel.checkBookInCategory(body)
    .then(([result, fields]) => {
      if (result[0].count == 0) {
        BookModel.addCategoryToBook(body)
          .then(([result, fields]) => {
            if (result.affectedRows == 1) {
              res.sendStatus(200);
            } else {
              throw Error("Issue occurs internally | DEBUG needed");
            }
          })
          .catch((err) => {
            _errHandler(err, res, "adding category to book");
          });
      } else {
        res.status(200).json({
          exist: true,
          msg: "It's currently in this category",
        });
      }
    })
    .catch((err) => {
      _errHandler(err, res, "checking category in book");
    });
};

exports.removeCategoryFromBook = (req, res) => {
  const body = {
    bookId: req.params.book,
    category: req.body.category,
  };

  BookModel.removeCategoryFromBook(body)
    .then(([result, fields]) => {
      if (result.affectedRows <= 1) {
        if (result.affectedRows == 1) {
          res.sendStatus(200);
        } else {
          res.status(200).json({
            exist: false,
            msg: "Category not in the book",
          });
        }
      } else {
        throw Error("Issue occurs internally | DEBUG needed");
      }
    })
    .catch((err) => {
      _errHandler(err, res, "removing category to book");
    });
};

exports.findAllAuthors = (req, res) => {
  BookModel.queryAllAuthors()
    .then(([rows, fields]) => {
      console.log(rows);
      res.status(200).json(rows);
    })
    .catch((err) => {
      _errHandler(err, res, "fetching all authors");
    });
};

exports.addAuthorToBook = (req, res) => {
  const body = {
    bookId: parseInt(req.params.book),
    author: req.body.author,
  };
  BookModel.checkIsAuthorOfBook(body)
    .then(([result, fields]) => {
      if (result[0].count == 0) {
        BookModel.addAuthorToBook(body)
          .then(([result, fields]) => {
            if (result.affectedRows == 1) {
              res.sendStatus(200);
            } else {
              throw Error("Issue occurs internally | DEBUG needed");
            }
          })
          .catch((err) => {
            _errHandler(err, res, "adding author to book");
          });
      } else {
        res.status(200).json({
          exist: true,
          msg: "The author is added to the book",
        });
      }
    })
    .catch((err) => {
      _errHandler(err, res, "checking author in book");
    });
};

exports.removeAuthorFromBook = (req, res) => {
  const body = {
    bookId: req.params.book,
    author: req.body.author,
  };

  BookModel.removeCategoryFromBook(body)
    .then(([result, fields]) => {
      if (result.affectedRows <= 1) {
        if (result.affectedRows == 1) {
          res.sendStatus(200);
        } else {
          res.status(200).json({
            exist: false,
            msg: "Author not in the book",
          });
        }
      } else {
        throw Error("Issue occurs internally | DEBUG needed");
      }
    })
    .catch((err) => {
      _errHandler(err, res, "removing author to book");
    });
};
