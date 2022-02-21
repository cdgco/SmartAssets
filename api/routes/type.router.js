const typeRouter = require('express').Router();
const type = require("../controllers/type.controller.js");

typeRouter.get("/", type.findAll);
typeRouter.delete("/:id", type.delete);

module.exports = typeRouter;