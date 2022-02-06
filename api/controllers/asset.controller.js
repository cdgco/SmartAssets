const db = require("../models");
const Asset = db.assets;
const Type = db.type;
const Manufacturer = db.manufacturer;
const Company = db.company;
const Model = db.model;
const Supplier = db.supplier;
const Tag = db.tag;

// Create and Save a new asset
exports.create = (req, res) => {

    const asset = new Asset({
        name: req.body.name,
        quantity: req.body.quantity ? req.body.quantity : "",
        location: req.body.location ? req.body.location : "",
        serial: req.body.serial ? req.body.serial : "",
        customFields: req.body.customFields ? req.body.customFields : "",
    });

    asset.save((err, asset) => {
        if (err) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
        }
        if (req.body.type) {
            Type.findOneAndUpdate({
                    name: req.body.type
                }, {
                    name: req.body.type
                }, {
                    new: true,
                    upsert: true
                },
                function(err, type) {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    } else {
                        asset.type.push(type);
                        asset.save(function(error) {
                            if (error) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [error || "Some error occurred while creating the assets."],
                                    "messages": [error || "Some error occurred while creating the assets."],
                                    "result": null
                                });
                            }
                        });
                    }
                });
        }
        if (req.body.manufacturer) {
            Manufacturer.findOneAndUpdate({
                    name: req.body.manufacturer
                }, {
                    name: req.body.manufacturer
                }, {
                    new: true,
                    upsert: true
                },
                function(err, manufacturer) {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    } else {
                        asset.manufacturer.push(manufacturer);
                        asset.save(function(error) {
                            if (error) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [error || "Some error occurred while creating the assets."],
                                    "messages": [error || "Some error occurred while creating the assets."],
                                    "result": null
                                });
                            }
                        });
                    }
                });
        }
        if (req.body.supplier) {
            Supplier.findOneAndUpdate({
                    name: req.body.supplier
                }, {
                    name: req.body.supplier
                }, {
                    new: true,
                    upsert: true
                },
                function(err, supplier) {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    } else {
                        asset.supplier.push(supplier);
                        asset.save(function(error) {
                            if (error) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [error || "Some error occurred while creating the assets."],
                                    "messages": [error || "Some error occurred while creating the assets."],
                                    "result": null
                                });
                            }
                        });
                    }
                });
        }
        if (req.body.company) {
            Company.findOneAndUpdate({
                    name: req.body.company
                }, {
                    name: req.body.company
                }, {
                    new: true,
                    upsert: true
                },
                function(err, company) {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    } else {
                        asset.company.push(company);
                        asset.save(function(error) {
                            if (error) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [error || "Some error occurred while creating the assets."],
                                    "messages": [error || "Some error occurred while creating the assets."],
                                    "result": null
                                });
                            }
                        });
                    }
                });
        }
        if (req.body.model) {
            Model.findOneAndUpdate({
                    name: req.body.model
                }, {
                    name: req.body.model
                }, {
                    new: true,
                    upsert: true
                },
                function(err, model) {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    } else {
                        asset.assetModel.push(model);
                        asset.save(function(error) {
                            if (error) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [error || "Some error occurred while creating the assets."],
                                    "messages": [error || "Some error occurred while creating the assets."],
                                    "result": null
                                });
                            }
                        });
                    }
                });
        }
        if (req.body.tags) {
            for (const tag in req.body.tags) {
                Tag.findOneAndUpdate({
                        name: tag
                    }, {
                        name: tag
                    }, {
                        new: true,
                        upsert: true
                    },
                    function(err, tag) {
                        if (err) {
                            return res.json({
                                "success": false,
                                "code": 500,
                                "errors": [err],
                                "messages": [err],
                                "result": null
                            });
                        } else {
                            asset.tags.push(tag);
                            asset.save(function(error) {
                                if (error) {
                                    return res.json({
                                        "success": false,
                                        "code": 500,
                                        "errors": [error || "Some error occurred while creating the assets."],
                                        "messages": [error || "Some error occurred while creating the assets."],
                                        "result": null
                                    });
                                }
                            });
                        }
                    });
            }
        }
        return res.json({
            "success": true,
            "code": 200,
            "errors": [],
            "messages": [],
            "result": null
        });
    })
}


// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    var dynCondition = {}
    if (req.query.name) {
        dynCondition.name = { $regex: new RegExp(req.query.name), $options: "i" }
    }
    if (req.query.id) {
        dynCondition._id = req.query.id
    }
    if (req.query.quantity) {
        dynCondition.quantity = req.query.quantity
    }
    if (req.query.serial) {
        dynCondition.serial = { $regex: new RegExp(req.query.serial), $options: "i" }
    }
    console.log(dynCondition);
    Asset.find(dynCondition)
        .populate("type", "name")
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
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": [],
                    "result": data
                });
            }
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

// Update a asset identified by the id in the request
exports.update = (req, res) => {
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
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [`${data.deletedCount} assets were deleted successfully!`],
                "result": null
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