const locationRouter = require('express').Router();
const location = require("../controllers/location.controller.js");

locationRouter.get("/", location.findAll);
locationRouter.delete("/:id", location.delete);

module.exports = locationRouter;