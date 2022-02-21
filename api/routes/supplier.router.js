const supplierRouter = require('express').Router();
const supplier = require("../controllers/supplier.controller.js");

supplierRouter.get("/", supplier.findAll);
supplierRouter.delete("/:id", supplier.delete);

module.exports = supplierRouter;