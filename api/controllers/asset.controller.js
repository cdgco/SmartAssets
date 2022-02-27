const db = require("../models");
const Asset = db.assets;
const Type = db.type;
const Location = db.location;
const Manufacturer = db.manufacturer;
const Company = db.company;
const Model = db.model;
const Supplier = db.supplier;
const Tags = db.tags;
const User = db.users;
const Event = db.event;
const { Client } = require('@elastic/elasticsearch')
const elasticConfig = require("../../elastic.config.js");
var jwt = require("jsonwebtoken");
const Papa = require('papaparse');
const elasticClient = new Client({
    node: elasticConfig.protocol + "://" + elasticConfig.host + ":" + elasticConfig.port,
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
})

function returnErr(res, err) {
    return res.json({
        "success": false,
        "code": 500,
        "errors": err,
        "messages": err,
        "result": null
    });
}

function returnSuccess(res, asset) {
    return res.json({
        "success": true,
        "code": 200,
        "errors": null,
        "messages": null,
        "result": asset
    });
}

function logEvent(req, title, description, asset, assetId, type, color) {
    if (req.get('Authorization')) {
        jwt.verify(req.get('Authorization').replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                User.findById(decoded.id).then(data => {
                    var user = (data.email) ? data.email : '';
                    const event = new Event({
                        title: title,
                        description: description,
                        user: user,
                        userId: decoded.id,
                        asset: asset,
                        assetId: assetId,
                        type: type,
                        color: color
                    });

                    event.save((error, event) => { return event });
                })
            } else {
                const event = new Event({
                    title: title,
                    description: description,
                    user: null,
                    userId: null,
                    asset: asset,
                    assetId: assetId,
                    type: type,
                    color: color
                });

                event.save((error, event) => { return event });
            }
        })
    } else {
        const event = new Event({
            title: title,
            description: description,
            user: null,
            user: null,
            asset: asset,
            assetId: assetId,
            type: type,
            color: color
        });

        event.save((error, event) => { return event });
    }
}

function createAsset(asset, req, res) {
    asset.save((error, asset) => {
        if (error) return returnErr(res, error)
        logEvent(req, "Created: " + asset.name, "Created Asset", asset.name, asset._id, "asset", "green")
        return returnSuccess(res, asset)
    });
}

function createTags(asset, req, res) {
    if (req.body.tags) { // If asset has tags
        if (req.body.tags.length > 0) {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true, rawResult: true },
                    function(err, data) {
                        if (err) return returnErr(res, err)
                        if (data.lastErrorObject.updatedExisting == false)
                            logEvent(req, "Created Tag: " + data.value.name, "Created Tag", null, null, "user", "green")
                        asset.tags.push(data.value);
                        if (index === array.length - 1) createAsset(asset, req, res)
                    });

            })
        } else createAsset(asset, req, res)
    } else createAsset(asset, req, res)
}

function createLocation(asset, req, res) {
    if (req.body.location) { // If asset has location
        Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location, $inc: { count: 1 } }, { new: true, upsert: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Location: " + data.value.name, "Created Location", null, null, "user", "green")
                asset.location.push(data.value);
                createTags(asset, req, res)
            });
    } else createTags(asset, req, res)
}

function createSupplier(asset, req, res) {
    if (req.body.supplier) { // If asset has supplier
        Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Supplier: " + data.value.name, "Created Supplier", null, null, "user", "green")
                asset.supplier.push(data.value);
                createLocation(asset, req, res)
            });
    } else createLocation(asset, req, res)
}

function createModel(asset, req, res) {
    if (req.body.model) { // If asset has model
        Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Model: " + data.value.name, "Created Model", null, null, "user", "green")
                asset.assetModel.push(data.value);
                createSupplier(asset, req, res)
            });
    } else createSupplier(asset, req, res)
}

function createCompany(asset, req, res) {
    if (req.body.company) { // If asset has company
        Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Company: " + data.value.name, "Created Company", null, null, "user", "green")
                asset.company.push(data.value);
                createModel(asset, req, res)
            });
    } else createModel(asset, req, res)
}

function createManufacturer(asset, req, res) {
    if (req.body.manufacturer) { // If asset has manufacturer
        Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Manufacturer: " + data.value.name, "Created Manufacturer", null, null, "user", "green")
                asset.manufacturer.push(data.value);
                createCompany(asset, req, res)
            });
    } else createCompany(asset, req, res)
}

function createType(asset, req, res) {
    if (req.body.type) { // If Asset has type
        Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) return returnErr(res, err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Type: " + data.value.name, "Created Type", null, null, "user", "green")
                asset.type.push(data.value);
                createManufacturer(asset, req, res)
            });
    } else createManufacturer(asset, req, res)
}

// Create and Save a new asset
exports.create = (req, res) => {
    const asset = new Asset({
        name: req.body.name,
        quantity: req.body.quantity ? req.body.quantity : "",
        serial: req.body.serial ? req.body.serial : "",
        customFields: req.body.customFields ? req.body.customFields : "",
    });
    createType(asset, req, res)
}

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    var dynCondition = {}
    var dynSort = {}
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
    if (req.query.sort && req.query.sort.toLowerCase() == "asc") {
        dynSort._id = 1;
    } else if (req.query.sort && req.query.sort.toLowerCase() == "desc") {
        dynSort._id = -1;
    }
    Asset.countDocuments(dynCondition)
        .then(data => {
            Asset.find(dynCondition)
                .populate("manufacturer")
                .populate("type")
                .populate("company")
                .populate("location")
                .populate("assetModel")
                .populate("supplier")
                .populate("tags")
                .skip(parseInt(req.query.skip) || 0)
                .limit(parseInt(req.query.limit) || 0)
                .sort(dynSort)
                .then(data1 => {
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": [],
                        "result": { count: data, results: data1 }
                    });
                })
                .catch(err => {
                    return res.json({
                        "success": false,
                        "code": 500,
                        "errors": [err.message || "Some error occurred while retrieving assets."],
                        "messages": [err.message || "Some error occurred while retrieving assets."],
                        "result": null
                    });
                });
        })
        .catch(err => {
            return res.json({
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
        .populate("manufacturer")
        .populate("type")
        .populate("company")
        .populate("location")
        .populate("assetModel")
        .populate("supplier")
        .populate("tags")
        .then(data => {
            if (!data) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No found asset with id " + id],
                    "messages": ["No found asset with id " + id],
                    "result": null
                });
            } else {
                return res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": [],
                    "result": data
                });
            }
        })
        .catch(err => {
            return res.json({
                "success": false,
                "code": 500,
                "errors": ["Error retrieving asset with id=" + id],
                "messages": ["Error retrieving asset with id=" + id],
                "result": null
            });
        });
};

function updateAsset(req, res, id, dynUpdate, updateDescription) {
    Asset.findByIdAndUpdate(id, dynUpdate, { useFindAndModify: false, returnDocument: 'after' })
        .populate("manufacturer")
        .populate("type")
        .populate("company")
        .populate("location")
        .populate("assetModel")
        .populate("supplier")
        .populate("tags")
        .then(data => {
            if (!data) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot update asset with id=${id}. Maybe asset was not found!`],
                    "messages": [`Cannot update asset with id=${id}. Maybe asset was not found!`],
                    "result": null
                });
            } else {
                logEvent(req, "Updated: " + data.name, updateDescription.join("\n"), data.name, data._id, "asset", "orange")
                return res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Asset was updated successfully!"],
                    "result": data
                });
            }
        })
        .catch(err => {
            return res.json({
                "success": false,
                "code": 500,
                "errors": ["Error updating asset with id=" + id],
                "messages": ["Error updating asset with id=" + id],
                "result": null
            });
        });
}

function updateTags(req, res, id, dynUpdate, updateDescription) {
    if (req.body.tags !== undefined) { // If asset has tags
        dynUpdate.tags = []
        if (req.body.tags.length == 0) {
            updateDescription.push("Removed Tags")
            updateAsset(req, res, id, dynUpdate, updateDescription)
        } else {
            var tagString = "Changed Tags to: ";
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true, rawResult: true },
                    function(err, data) {
                        if (err) return returnErr(res, err)
                        if (data.lastErrorObject.updatedExisting == false)
                            logEvent(req, "Created Tag: " + data.value.name, "Created Tag", null, null, "user", "green")
                        dynUpdate.tags.push(data.value);
                        if (index === array.length - 1) {
                            tagString = tagString + data.value.name
                            updateDescription.push(tagString)
                            updateAsset(req, res, id, dynUpdate, updateDescription)
                        } else {
                            tagString = tagString + data.value.name + ", "
                        }
                    });
            })
        }
    } else updateAsset(req, res, id, dynUpdate, updateDescription)
}

function updateLocation(req, res, id, dynUpdate, updateDescription) {
    if (req.body.location !== undefined) { // If location updated
        if (oldAsset.location[0] && oldAsset.location[0].count > 0)
            Location.findByIdAndUpdate(oldAsset.location[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.location == '') {
            updateDescription.push("Removed Location")
            dynUpdate.location = []
            updateTags(req, res, id, dynUpdate, updateDescription)
        } else {
            Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Location to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Location: " + data.value.name, "Created Location", null, null, "user", "green")
                    dynUpdate.location = [data.value._id]
                    updateTags(req, res, id, dynUpdate, updateDescription)
                });
        }
    } else updateTags(req, res, id, dynUpdate, updateDescription)
}

function updateSupplier(req, res, id, dynUpdate, updateDescription, oldAsset) {
    if (req.body.supplier !== undefined) { // If supplier updated
        if (oldAsset.supplier[0] && oldAsset.supplier[0].count > 0)
            Supplier.findByIdAndUpdate(oldAsset.supplier[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.supplier == '') {
            updateDescription.push("Removed Supplier")
            dynUpdate.supplier = []
            updateLocation(req, res, id, dynUpdate, updateDescription)
        } else {
            Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Supplier to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Supplier: " + data.value.name, "Created Supplier", null, null, "user", "green")
                    dynUpdate.supplier = [data.value._id]
                    updateLocation(req, res, id, dynUpdate, updateDescription)
                });
        }
    } else updateLocation(req, res, id, dynUpdate, updateDescription)
}

function updateModel(req, res, id, dynUpdate, updateDescription, oldAsset) {
    if (req.body.model !== undefined) { // If model updated
        if (oldAsset.assetModel[0] && oldAsset.assetModel[0].count > 0)
            Model.findByIdAndUpdate(oldAsset.assetModel[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.model == '') {
            updateDescription.push("Removed Model")
            dynUpdate.assetModel = []
            updateSupplier(req, res, id, dynUpdate, updateDescription, oldAsset)
        } else {
            Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Model to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Model: " + data.value.name, "Created Model", null, null, "user", "green")
                    dynUpdate.assetModel = [data.value._id]
                    updateSupplier(req, res, id, dynUpdate, updateDescription, oldAsset)
                });
        }
    } else updateSupplier(req, res, id, dynUpdate, updateDescription, oldAsset)
}

function updateCompany(req, res, id, dynUpdate, updateDescription, oldAsset) {
    if (req.body.company !== undefined) { // If company updated
        if (oldAsset.company[0] && oldAsset.company[0].count > 0)
            Company.findByIdAndUpdate(oldAsset.company[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.company == '') {
            updateDescription.push("Removed Company")
            dynUpdate.company = []
            updateModel(req, res, id, dynUpdate, updateDescription, oldAsset)
        } else {
            Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Company to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Company: " + data.value.name, "Created Company", null, null, "user", "green")
                    dynUpdate.company = [data.value._id]
                    updateModel(req, res, id, dynUpdate, updateDescription, oldAsset)
                });
        }
    } else updateModel(req, res, id, dynUpdate, updateDescription, oldAsset)
}

function updateManufacturer(req, res, id, dynUpdate, updateDescription, oldAsset) {
    if (req.body.manufacturer !== undefined) { // If manufacturer updated
        if (oldAsset.manufacturer[0] && oldAsset.manufacturer[0].count > 0)
            Manufacturer.findByIdAndUpdate(oldAsset.manufacturer[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.manufacturer == '') {
            updateDescription.push("Removed Manufacturer")
            dynUpdate.manufacturer = []
            updateCompany(req, res, id, dynUpdate, updateDescription, oldAsset)
        } else {
            Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Manufacturer to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Manufacturer: " + data.value.name, "Created Manufacturer", null, null, "user", "green")
                    dynUpdate.manufacturer = [data.value._id]
                    updateCompany(req, res, id, dynUpdate, updateDescription, oldAsset)
                });
        }
    } else updateCompany(req, res, id, dynUpdate, updateDescription, oldAsset)
}

function updateType(req, res, id, dynUpdate, updateDescription, oldAsset) {
    if (req.body.type !== undefined) { // If type updated
        if (oldAsset.type[0] && oldAsset.type[0].count > 0)
            Type.findByIdAndUpdate(oldAsset.type[0]._id, { $inc: { count: -1 } }).exec();
        if (req.body.type == '') {
            updateDescription.push("Removed Type")
            dynUpdate.type = []
            updateManufacturer(req, res, id, dynUpdate, updateDescription, oldAsset)
        } else {
            Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
                    updateDescription.push("Changed Type to: " + data.value.name)
                    if (data.lastErrorObject.updatedExisting == false)
                        logEvent(req, "Created Type: " + data.value.name, "Created Type", null, null, "user", "green")
                    dynUpdate.type = [data.value._id]
                    updateManufacturer(req, res, id, dynUpdate, updateDescription, oldAsset)
                });
        }
    } else updateManufacturer(req, res, id, dynUpdate, updateDescription, oldAsset)
}

// Update an asset identified by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    var dynUpdate = {}
    var updateDescription = []
    if (req.body.name !== undefined) {
        updateDescription.push("Changed Name to: " + req.body.name.toString())
        dynUpdate.name = req.body.name
    }
    if (req.body.quantity !== undefined) {
        console.log(req.body.quantity.toString())
        if (req.body.quantity == -1) {
            updateDescription.push("Removed Quantity")
            dynUpdate.quantity = null
        } else {
            updateDescription.push("Changed Quantity to: " + req.body.quantity.toString())
            dynUpdate.quantity = req.body.quantity
        }
    }
    if (req.body.serial !== undefined) {
        if (req.body.serial == '') {
            updateDescription.push("Removed Serial")
        } else {
            updateDescription.push("Changed Serial to: " + req.body.serial.toString())
        }
        dynUpdate.serial = req.body.serial
    }
    Asset.findById(id)
        .populate("manufacturer")
        .populate("type")
        .populate("company")
        .populate("location")
        .populate("assetModel")
        .populate("supplier")
        .then(data => {
            if (!data) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No found asset with id " + id],
                    "messages": ["No found asset with id " + id],
                    "result": null
                });
            } else {
                updateType(req, res, id, dynUpdate, updateDescription, data)
            }
        })
        .catch(err => {
            return res.json({
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

    Asset.findById(id)
        .populate("manufacturer")
        .populate("type")
        .populate("company")
        .populate("location")
        .populate("assetModel")
        .populate("supplier")
        .then(assetData => {
            if (!assetData) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No found asset with id " + id],
                    "messages": ["No found asset with id " + id],
                    "result": null
                });
            } else {
                var data = JSON.parse(JSON.stringify(assetData))
                console.log(data)
                if (data.manufacturer[0] && data.manufacturer[0].count > 0) Manufacturer.findByIdAndUpdate(data.manufacturer[0]._id, { $inc: { count: -1 } }).exec();
                if (data.type[0] && data.type[0].count > 0) Type.findByIdAndUpdate(data.type[0]._id, { $inc: { count: -1 } }).exec();
                if (data.company[0] && data.company[0].count > 0) Company.findByIdAndUpdate(data.company[0]._id, { $inc: { count: -1 } }).exec();
                if (data.location[0] && data.location[0].count > 0) Location.findByIdAndUpdate(data.location[0]._id, { $inc: { count: -1 } }).exec();
                if (data.assetModel[0] && data.assetModel[0].count > 0) Model.findByIdAndUpdate(data.assetModel[0]._id, { $inc: { count: -1 } }).exec();
                if (data.supplier[0] && data.supplier[0].count > 0) Supplier.findByIdAndUpdate(data.supplier[0]._id, { $inc: { count: -1 } }).exec();
                Asset.findByIdAndRemove(id)
                    .then(data => {
                        if (!data) {
                            return res.json({
                                "success": false,
                                "code": 404,
                                "errors": [`Cannot delete asset with id=${id}. Maybe asset was not found!`],
                                "messages": [`Cannot delete asset with id=${id}. Maybe asset was not found!`],
                                "result": null
                            });
                        } else {
                            logEvent(req, "Deleted: " + data.name, "Deleted Asset from Database", data.name, data._id, "asset", "red")
                            return res.json({
                                "success": true,
                                "code": 200,
                                "errors": [],
                                "messages": ["Asset was deleted successfully!"],
                                "result": null
                            });
                        }
                    })
                    .catch(err => {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": ["Could not delete asset with id=" + id],
                            "messages": ["Could not delete asset with id=" + id],
                            "result": null
                        });
                    });
            }
        })
        .catch(err => {
            return res.json({
                "success": false,
                "code": 500,
                "errors": ["Error updating asset with id=" + id],
                "messages": ["Error updating asset with id=" + id],
                "result": null
            });
        });
};

// Delete all assets from the database.
exports.deleteAll = (req, res) => {
    logEvent(req, "Deleted Assets", "Deleted All Assets from Database", null, "asset", "red")
    Asset.deleteMany({})
        .then(data => {
            Manufacturer.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            Type.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            Company.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            Location.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            Model.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            Supplier.updateMany({ count: { $gt: 0 } }, { count: 0 }).exec();
            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [`${data.deletedCount} assets were deleted successfully!`],
                "result": null
            });
        })
        .catch(err => {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while removing all assets."],
                "messages": [err.message || "Some error occurred while removing all assets."],
                "result": null
            });
        });
};

function insertAsset(asset, res) {
    asset.save((error, asset) => {
        if (error) res.push(error)
        logEvent(req, "Imported: " + asset.name, "Imported Asset from CSV", asset.name, asset._id, "asset", "green")
    });
}

function insertTags(asset, req, res) {
    if (req.body.tags) { // If asset has tags
        if (req.body.tags.length > 0) {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true, rawResult: true },
                    function(err, data) {
                        if (err) res.push(err)
                        if (data.lastErrorObject.updatedExisting == false)
                            logEvent(req, "Created Tag: " + data.value.name, "Created Tag vie import", null, null, "user", "green")
                        asset.tags.push(data.value);
                        if (index === array.length - 1) insertAsset(asset, res)
                    });

            })
        } else insertAsset(asset, res)
    } else insertAsset(asset, res)
}

function insertLocation(asset, req, res) {
    if (req.body.location) { // If asset has location
        Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Location: " + data.value.name, "Created Location via import", null, null, "user", "green")
                asset.location.push(data.value);
                insertTags(asset, req, res)
            });
    } else insertTags(asset, req, res)
}

function insertSupplier(asset, req, res) {
    if (req.body.supplier) { // If asset has supplier
        Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Supplier: " + data.value.name, "Created Supplier via import", null, null, "user", "green")
                asset.supplier.push(data.value);
                insertLocation(asset, req, res)
            });
    } else insertLocation(asset, req, res)
}

function insertModel(asset, req, res) {
    if (req.body.model) { // If asset has model
        Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Model: " + data.value.name, "Created Model via import", null, null, "user", "green")
                asset.assetModel.push(data.value);
                insertSupplier(asset, req, res)
            });
    } else insertSupplier(asset, req, res)
}

function insertCompany(asset, req, res) {
    if (req.body.company) { // If asset has company
        Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Company: " + data.value.name, "Created Company via import", null, null, "user", "green")
                asset.company.push(data.value);
                insertModel(asset, req, res)
            });
    } else insertModel(asset, req, res)
}

function insertManufacturer(asset, req, res) {
    if (req.body.manufacturer) { // If asset has manufacturer
        Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Manufacturer: " + data.value.name, "Created Tag via import", null, null, "user", "green")
                asset.manufacturer.push(data.value);
                insertCompany(asset, req, res)
            });
    } else insertCompany(asset, req, res)
}

function insertType(asset, req, res) {
    if (req.body.type) { // If Asset has type
        Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type, $inc: { count: 1 } }, { new: true, upsert: true, rawResult: true },
            function(err, data) {
                if (err) res.push(err)
                if (data.lastErrorObject.updatedExisting == false)
                    logEvent(req, "Created Type: " + data.value.name, "Created Type via import", null, null, "user", "green")
                asset.type.push(data.value);
                insertManufacturer(asset, req, res)
            });
    } else insertManufacturer(asset, req, res)
}

exports.importCSV = (req, res) => {
    logEvent(req, "Imported Assets", "Imported Assets from CSV", null, null, "asset", "green")
    var errArr = []
    if (!req.files[0] || req.files[0].mimetype != 'text/csv') {
        return res.json({
            "success": false,
            "code": 400,
            "errors": ['Invalid File'],
            "messages": [],
            "result": null
        });
    } else {
        var fileBuffer = req.files[0].buffer.toString()
        var csv = Papa.parse(fileBuffer, {
            header: true,
            skipEmptyLines: true
        })
        csv.data.forEach(function(element, index, array) {
            const asset = new Asset({
                name: (element.Name || element.name || ''),
                quantity: (element.Quantity || element.quantity || ''),
                serial: (element.Serial || element.serial || element.SerialNumber || element.serialnumber || ''),
            });
            var assetRequest = { body: {} }
            assetRequest.body.type = (element.Type || element.type || '')
            assetRequest.body.location = (element.Location || element.location || '')
            assetRequest.body.manufacturer = (element.Manufacturer || element.manufacturer || '')
            assetRequest.body.supplier = (element.Supplier || element.supplier || '')
            assetRequest.body.company = (element.Company || element.company || '')
            insertType(asset, assetRequest, errArr)
            if (index === array.length - 1) {
                return res.json({
                    "success": true,
                    "code": 200,
                    "errors": errArr,
                    "messages": [],
                    "result": null
                });
            }
        });
    }
};

exports.exportCSV = (req, res) => {
    logEvent(req, "Exported Assets", "Generated and Exported CSV of Assets", null, null, "user", "green")

    var dataCopy = []
    req.body.assets.forEach(function(element, index, array) {
        var tags = []
        if (element.tags && element.tags[0]) {
            element.tags.forEach(function(tag, index, array) {
                tags.push(tag.name)
            })
        }
        var newAsset = {
            name: element.name,
            quantity: (element.quantity) ? element.quantity : '',
            location: (element.location && element.location[0]) ? element.location[0].name : '',
            type: (element.type && element.type[0]) ? element.type[0].name : '',
            manufacturer: (element.manufacturer && element.manufacturer[0]) ? element.manufacturer[0].name : '',
            supplier: (element.supplier && element.supplier[0]) ? element.supplier[0].name : '',
            company: (element.company && element.company[0]) ? element.company[0].name : '',
            serial: (element.serial) ? element.serial : '',
            model: (element.assetModel && element.assetModel[0]) ? element.assetModel[0].name : '',
            tags: tags,
        }
        if (element.customFields && element.customFields[0]) {
            element.customFields.forEach(function(field, index, array) {
                newAsset[field.name] = field.value
            })
        }
        dataCopy.push(newAsset)
        if (index === array.length - 1) {
            var csv = Papa.unparse(JSON.stringify(dataCopy))
            res.header('Content-Type', 'text/csv')
            res.attachment('assets.csv')
            return res.send(csv)
        }
    })

};

exports.search = (req, res) => {
    var searchCount = 0;
    if (!isNaN(req.query.q)) {
        Asset.findById(req.query.q)
            .populate("manufacturer")
            .populate("type")
            .populate("company")
            .populate("location")
            .populate("assetModel")
            .populate("supplier")
            .populate("tags")
            .then(data => {
                if (!data) {
                    Asset.esCount({
                            "query": {
                                "multi_match": {
                                    "query": req.query.q,
                                    "fuzziness": "4",
                                    "fields": ["name", "location", "serial", "assetModel", "tags", "customFields"],
                                    "lenient": true
                                }
                            }
                        })
                        .then(function(results) {
                            searchCount = results.count
                            Asset.esSearch({
                                    "from": (parseInt(req.query.skip) || 0),
                                    "size": (parseInt(req.query.limit) || 10),
                                    "query": {
                                        "multi_match": {
                                            "query": req.query.q,
                                            "fuzziness": "4",
                                            "fields": ["name", "location", "serial", "assetModel", "tags", "customFields"],
                                            "lenient": true
                                        }
                                    }
                                })
                                .then(function(results) {
                                    // results.count = searchCount
                                    return res.json({
                                        "success": true,
                                        "code": 200,
                                        "errors": [],
                                        "messages": [],
                                        "result": results
                                    });
                                });
                        });

                } else {
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": [],
                        "result": {
                            "timed_out": false,
                            "hits": {
                                "total": {
                                    "value": 1,
                                    "realtion": "eq"
                                },
                                "hits": [{
                                    "_index": "assets",
                                    "_type": "asset",
                                    "_id": data._id,
                                    "_score": 1.0,
                                    "_source": {
                                        data
                                    }
                                }, ]
                            }
                        }
                    });
                }
            })
            .catch(err => {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": ["Error retrieving asset with id=" + id],
                    "messages": ["Error retrieving asset with id=" + id],
                    "result": null
                });
            });
    } else {
        Asset.esCount({
                "query": {
                    "multi_match": {
                        "query": req.query.q,
                        "fuzziness": "4",
                        "fields": ["name", "location", "serial", "assetModel", "tags", "customFields"],
                        "lenient": true
                    }
                }
            })
            .then(function(results) {
                searchCount = results.count
                Asset.esSearch({
                        "from": (parseInt(req.query.skip) || 0),
                        "size": (parseInt(req.query.limit) || 50),
                        "query": {
                            "multi_match": {
                                "query": req.query.q,
                                "fuzziness": "4",
                                "fields": ["name", "location", "serial", "assetModel", "tags", "customFields"],
                                "lenient": true
                            }
                        }
                    })
                    .then(function(results) {
                        results.count = searchCount
                        return res.json({
                            "success": true,
                            "code": 200,
                            "errors": [],
                            "messages": [],
                            "result": results
                        });
                    });
            });
    }
};

exports.nativeSearch = (req, res) => {
    var searchCount = 0;
    if (!isNaN(req.query.q)) {
        Asset.findById(req.query.q)
            .populate("manufacturer")
            .populate("type")
            .populate("company")
            .populate("location")
            .populate("assetModel")
            .populate("supplier")
            .populate("tags")
            .then(data => {
                if (!data) {
                    elasticClient.count({
                        index: 'assets',
                        body: {
                            query: {
                                multi_match: {
                                    query: req.query.q,
                                    fuzziness: 4,
                                    fields: ["name", "location.name", "type.name", "manufacturer.name", "assetModel.name", "tags", "customFields"],
                                    lenient: true
                                }
                            }
                        }
                    }, (err, results) => {
                        if (err) {
                            return res.json({
                                "success": false,
                                "code": 500,
                                "errors": [err],
                                "messages": [],
                                "result": null
                            });
                        }
                        searchCount = results.body.count
                        elasticClient.search({
                            index: 'assets',
                            body: {
                                from: (parseInt(req.query.skip) || 0),
                                size: (parseInt(req.query.limit) || 50),
                                query: {
                                    multi_match: {
                                        query: req.query.q,
                                        fuzziness: 4,
                                        fields: ["name", "location.name", "type.name", "manufacturer.name", "assetModel.name", "tags", "customFields"],
                                        lenient: true
                                    }
                                }
                            }
                        }, (err2, results2) => {
                            if (err2) {
                                return res.json({
                                    "success": false,
                                    "code": 500,
                                    "errors": [err2],
                                    "messages": [],
                                    "result": null
                                });
                            }
                            results2.body.count = searchCount
                            return res.json({
                                "success": true,
                                "code": 200,
                                "errors": [],
                                "messages": [],
                                "result": results2.body
                            });
                        })
                    });
                } else {
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": ["exact-match"],
                        "result": {
                            "timed_out": false,
                            "hits": {
                                "total": {
                                    "value": 1,
                                    "realtion": "eq"
                                },
                                "hits": [{
                                    "_index": "assets",
                                    "_type": "asset",
                                    "_id": data._id,
                                    "_score": 1.0,
                                    "_source": {
                                        data
                                    }
                                }, ]
                            }
                        }
                    });
                }
            })
            .catch(err => {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": ["Error retrieving asset with id=" + id],
                    "messages": ["Error retrieving asset with id=" + id],
                    "result": null
                });
            });
    } else {
        elasticClient.count({
            index: 'assets',
            body: {
                query: {
                    multi_match: {
                        query: req.query.q,
                        fuzziness: 4,
                        fields: ["name", "location.name", "type.name", "manufacturer.name", "assetModel.name", "tags", "customFields"],
                        lenient: true
                    }
                }
            }
        }, (err, results) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [],
                    "result": null
                });
            }
            searchCount = results.body.count
            elasticClient.search({
                index: 'assets',
                body: {
                    from: (parseInt(req.query.skip) || 0),
                    size: (parseInt(req.query.limit) || 50),
                    query: {
                        multi_match: {
                            query: req.query.q,
                            fuzziness: 4,
                            fields: ["name", "location.name", "type.name", "manufacturer.name", "assetModel.name", "tags", "customFields"],
                            lenient: true
                        }
                    }
                }
            }, (err, results) => {
                if (err) {
                    return res.json({
                        "success": false,
                        "code": 500,
                        "errors": [err],
                        "messages": [],
                        "result": null
                    });
                }
                results.body.count = searchCount
                return res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": [],
                    "result": results.body
                });

            })
        });
    }
};