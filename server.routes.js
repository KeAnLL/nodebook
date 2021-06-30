const express = require("express");
const server = express.Router();

const UsersRouter = require("./users/users.routes");
const ProfileRouter = require("./users/profile.routes");
const BookRouter = require("./app/book/book.routes");

server.use("/user", [UsersRouter]);

server.use("/profile", [ProfileRouter]);

server.use("/book", [BookRouter]);

module.exports = server;
