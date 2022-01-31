const assetRouter = require('express').Router();
const assets = require("../controllers/asset.controller.js");

// Create a new asset
assetRouter.post("/", assets.create);

// Retrieve all assets
assetRouter.get("/", assets.findAll);

// Retrieve a single asset with id
assetRouter.get("/:id", assets.findOne);

// Update an asset with id
assetRouter.put("/:id", assets.update);

// Delete an asset with id
assetRouter.delete("/:id", assets.delete);

// Delete all assets
assetRouter.delete("/", assets.deleteAll);

module.exports = assetRouter;