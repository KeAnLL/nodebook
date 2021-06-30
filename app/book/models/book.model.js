const conn = require("../../../utils/database.config");

exports.createBook = (bookData) => {
  const insertBookSql = `
        INSERT INTO
            book (book_name, book_desc, book_added_date, user_id)
        VALUES(
            ?, ?, NOW(), ?
        )
    `;
  return conn
    .promise()
    .query(insertBookSql, [
      bookData.book_name,
      bookData.book_desc,
      bookData._id,
    ]);
};

exports.updateBook = (bookData) => {
  const updateBookSql = `
    UPDATE book
    SET
      book_name = ?, 
      book_desc = ?
    WHERE
      book_id = ?
  `;
  return conn
    .promise()
    .query(updateBookSql, [
      bookData.book_name,
      bookData.book_desc,
      bookData._id,
    ]);
};

exports.deleteBook = (bookId) => {
  const deleteBookSql = `DELETE FROM book WHERE book_id = ${bookId}`;
  return conn.promise().query(deleteBookSql);
};

exports.deleteBooks = (bookIdList) => {
  const deleteBooksSql = `
    DELETE FROM book WHERE book_id IN (${bookIdList.join(",")})
  `;
  return conn.promise().query(deleteBooksSql);
};

exports.queryAllBooks = () => {
  const queryAllBooksSql =
    "SELECT book_id, book_name, book_desc, book_added_date, book_sold FROM book";
  return conn.promise().query(queryAllBooksSql);
};

exports.queryBookById = (bookId) => {
  const queryIdSql = `SELECT book_id, book_name, book_desc, book_added_date, book_sold FROM book WHERE book_id = ${bookId}`;
  return conn.promise().query(queryIdSql);
};

exports.queryBookByCategories = (categoryList) => {
  const queryBookCategorySql = `
    SELECT
      *
    FROM
      book_in_category
        JOIN
      book
        USING (book_id)
    WHERE cat_id IN (${categoryList.join(",")})
  `;
  return conn.promise().query(queryBookCategorySql);
};

exports.queryBookByUserId = (userId) => {
  const queryByUserSql = `SELECT * FROM book WHERE userId = ${userId}`;
  return conn.promise().query(queryByUserSql);
};

exports.queryAllCategories = () => {
  const queryAllCategories = "SELECT * FROM book_category ORDER BY cat_id";
  return conn.promise().query(queryAllCategories);
};

exports.checkBookInCategory = (bookWithCategory) => {
  const queryCategorySql = `SELECT COUNT(*) AS count FROM book_category 
    WHERE book_id = ${bookWithCategory.bookId} AND cat_id = ${bookWithCategory.category}`;
  return conn.promise().query(queryCategorySql);
};

exports.addCategoryToBook = (bookWithCategory) => {
  const addCategorySql = `
    INSERT INTO book_in_category
    VALUES (${bookWithCategory.bookId}, ${bookWithCategory.category})
  `;
  return conn.promise().query(addCategorySql);
};

exports.removeCategoryFromBook = (bookWithCategory) => {
  const deleteCategorySql = `
    DELETE FROM book_in_category
    WHERE book_id=${bookWithCategory.bookId} AND cat_id=${bookWithCategory.category}
  `;
  return conn.promise().query(deleteCategorySql);
};

exports.queryCategoryByBook = (bookId) => {
  const queryCategoryByBookSql = `
    SELECT
      cat_id, cat_name
    FROM
      book_in_category bic
        JOIN
      book_category bc
        USING (cat_id)
    WHERE
      book_id = ${bookId}
  `;
  return conn.promise().query(queryCategoryByBookSql);
};

exports.queryAllAuthors = () => {
  const queryAuthorsSql = "SELECT * FROM author";
  return conn.promise().query(queryAuthorsSql);
};

exports.checkIsAuthorOfBook = (bookWithAuthor) => {
  const queryAuthorSql = `SELECT COUNT(*) AS count FROM book_author
    WHERE book_id = ${bookWithAuthor.bookId} AND author_id = ${bookWithAuthor.author}`;
  return conn.promise().query(queryAuthorSql);
};

exports.addAuthorToBook = (bookWithAuthor) => {
  const addAuthorSql = `INSERT INTO book_author VALUES (${bookWithAuthor.bookId}, ${bookWithAuthor.author})`;
  return conn.promise().query(addAuthorSql);
};

exports.removeAuthorFromBook = (bookWithAuthor) => {
  const removeAuthorSql = `DELETE FROM book_author
  WHERE book_id = ${bookWithAuthor.bookId} AND author_id = ${bookWithAuthor.author}`;
  return conn.promise().query(removeAuthorSql);
};

exports.queryAuthorByBook = (bookId) => {
  const queryCategoryByBookSql = `
    SELECT
      author_id, author_name
    FROM
      book_author
        JOIN
      author
        USING (author_id)
    WHERE
      book_id = ${bookId}
  `;
  return conn.promise().query(queryCategoryByBookSql);
};