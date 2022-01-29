const db = require("../models");
const Asset = db.assets;

// Create and Save a new asset
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.json({
            "success": false,
            "code": 400,
            "errors": ["Data can not be empty!"],
            "messages": ["Data can not be empty!"],
            "result": null
        });
    }

    // Create a Tutorial
    const asset = new Asset({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    // Save Tutorial in the database
    asset
        .save(asset)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while creating the assets."],
                "messages": [err.message || "Some error occurred while creating the assets."],
                "result": null
            });
        });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Asset.find(condition)
        .then(data => {
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": data
            });
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while retrieving assets."],
                "messages": [err.message || "Some error occurred while retrieving assets."],
                "result": null
            });
        });
};



// Find a single asset with a id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Asset.findById(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No found asset with id " + id],
                    "messages": ["No found asset with id " + id],
                    "result": null
                });
            } else res.send(data);
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Error retrieving asset with id=" + id],
                "messages": ["Error retrieving asset with id=" + id],
                "result": null
            });
        });
};

// find all published assets
exports.findAllPublished = (req, res) => {
    Asset.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while retrieving assets."],
                "messages": [err.message || "Some error occurred while retrieving assets."],
                "result": null
            });
        });
};

// Update a asset identified by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.json({
            "success": false,
            "code": 400,
            "errors": ["Data to update can not be empty!"],
            "messages": ["Data to update can not be empty!"],
            "result": null
        });
    }

    const id = req.params.id;

    Asset.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot update asset with id=${id}. Maybe asset was not found!`],
                    "messages": [`Cannot update asset with id=${id}. Maybe asset was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Asset was updated successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Error updating asset with id=" + id],
                "messages": ["Error updating asset with id=" + id],
                "result": null
            });
        });
};

// Delete an asset with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Asset.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete asset with id=${id}. Maybe asset was not found!`],
                    "messages": [`Cannot delete asset with id=${id}. Maybe asset was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Asset was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete asset with id=" + id],
                "messages": ["Could not delete asset with id=" + id],
                "result": null
            });
        });
};

// Delete all assets from the database.
exports.deleteAll = (req, res) => {
    Asset.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} assets were deleted successfully!`
            });
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while removing all assets."],
                "messages": [err.message || "Some error occurred while removing all assets."],
                "result": null
            });
        });
};