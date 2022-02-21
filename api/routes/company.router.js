const companyRouter = require('express').Router();
const company = require("../controllers/company.controller.js");

companyRouter.get("/", company.findAll);
companyRouter.delete("/:id", company.delete);

module.exports = companyRouter;