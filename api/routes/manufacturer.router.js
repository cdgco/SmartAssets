const manufacturerRouter = require('express').Router();
const manufacturer = require("../controllers/manufacturer.controller.js");

manufacturerRouter.get("/", manufacturer.findAll);
manufacturerRouter.delete("/:id", manufacturer.delete);

module.exports = manufacturerRouter;