const assetRouter = require('express').Router();
const assets = require("../controllers/asset.controller.js");

// Create a new asset
assetRouter.post("/", assets.create);

// Retrieve all assets
assetRouter.get("/", assets.findAll);

// Retrieve all assets
assetRouter.get("/search", assets.search);

// Retrieve all assets
assetRouter.get("/nativesearch", assets.nativeSearch);

// Import assets from CSV
assetRouter.post("/import", assets.importCSV);

// Export assets to CSV
assetRouter.post("/export", assets.exportCSV);

// Retrieve a single asset with id
assetRouter.get("/:id", assets.findOne);

// Update an asset with id
assetRouter.put("/:id", assets.update);

// Delete an asset with id
assetRouter.delete("/:id", assets.delete);

// Delete all assets
assetRouter.delete("/", assets.deleteAll);

module.exports = assetRouter;