const modelRouter = require('express').Router();
const model = require("../controllers/model.controller.js");

modelRouter.get("/", model.findAll);
modelRouter.delete("/:id", model.delete);

module.exports = modelRouter;