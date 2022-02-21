const tagsRouter = require('express').Router();
const tags = require("../controllers/tags.controller.js");

tagsRouter.get("/", tags.findAll);
tagsRouter.delete("/:id", tags.delete);

module.exports = tagsRouter;