const profile = require("express").Router();

const ProfileController = require("./controllers/profile.controllers");
const {authenticateJWT} = require("./auth/middleware/auth.js");

profile.get("/test", ProfileController.testProfile);

profile.post("/create", authenticateJWT, ProfileController.createProfile);

profile.post("/update", authenticateJWT, ProfileController.updateProfile);

profile.get("/:id", ProfileController.findProfileById);

module.exports = profile;
