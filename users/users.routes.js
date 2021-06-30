const express = require("express");
const users = express.Router();

const UsersController = require("./controllers/users.controllers");

users.get("/test", UsersController.testUser);

users.post("/create", UsersController.createUser);

users.patch("/update", UsersController.updateUser);

users.get("/query", UsersController.findUserById);

users.get("/query/byname", UsersController.findUserByUsername);

users.get("/query/bymail", UsersController.findUserByEmail);

// users.get("/auth", UsersController);

module.exports = users;
