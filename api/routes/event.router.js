const eventRouter = require('express').Router();
const event = require("../controllers/event.controller.js");

eventRouter.get("/", event.findAll);

module.exports = eventRouter;