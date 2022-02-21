const db = require("../models");
const Asset = db.assets;
const Type = db.type;
const Location = db.location;
const Manufacturer = db.manufacturer;
const Company = db.company;
const Model = db.model;
const Supplier = db.supplier;
const Tags = db.tags;
const { Client } = require('@elastic/elasticsearch')
const elasticConfig = require("../../elastic.config.js");
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

function createAsset(asset, res) {
    asset.save((error, asset) => {
        if (error) return returnErr(error)
        else return returnSuccess(asset)
    });
}

function createTags(asset, req, res) {
    if (req.body.tags) { // If asset has tags
        req.body.tags.forEach(function(tag, index, array) {
            Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true },
                function(err, tag) {
                    if (err) return returnErr(err)
                    else {
                        asset.tags.push(tag);
                        if (index === array.length - 1) createAsset(asset, res)
                    }
                });
        })
    } else createAsset(asset, res)
}

function createLocation(asset, req, res) {
    if (req.body.location) { // If asset has location
        Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location }, { new: true, upsert: true },
            function(err, location) {
                if (err) return returnErr(err)
                else {
                    asset.location.push(location);
                    createTags(asset, req, res)
                }
            });
    } else createTags(asset, req, res)
}

function createSupplier(asset, req, res) {
    if (req.body.supplier) { // If asset has supplier
        Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier }, { new: true, upsert: true },
            function(err, supplier) {
                if (err) return returnErr(err)
                else {
                    asset.supplier.push(supplier);
                    createLocation(asset, req, res)
                }
            });
    } else createLocation(asset, req, res)
}

function createModel(asset, req, res) {
    if (req.body.model) { // If asset has model
        Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model }, { new: true, upsert: true },
            function(err, model) {
                if (err) return returnErr(err)
                else {
                    asset.assetModel.push(model);
                    createSupplier(asset, req, res)
                }
            });
    } else createSupplier(asset, req, res)
}

function createCompany(asset, req, res) {
    if (req.body.company) { // If asset has company
        Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company }, { new: true, upsert: true },
            function(err, company) {
                if (err) return returnErr(err)
                else {
                    asset.company.push(company);
                    createModel(asset, req, res)
                }
            });
    } else createModel(asset, req, res)
}

function createManufacturer(asset, req, res) {
    if (req.body.manufacturer) { // If asset has manufacturer
        Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer }, { new: true, upsert: true },
            function(err, manufacturer) {
                if (err) return returnErr(err)
                else {
                    asset.manufacturer.push(manufacturer);
                    createCompany(asset, req, res)
                }
            });
    } else createCompany(asset, req, res)
}

function createType(asset, req, res) {
    if (req.body.type) { // If Asset has type
        Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type }, { new: true, upsert: true },
            function(err, type) {
                if (err) return returnErr(err)
                else {
                    asset.type.push(type);
                    createManufacturer(asset, req, res)
                }
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
                .limit(parseInt(req.query.limit) || 0)
                .skip(parseInt(req.query.skip) || 0)
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

function updateAsset(id, dynUpdate, res) {
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

function updateTags(req, res, id, dynUpdate) {
    if (req.body.tags !== undefined) { // If asset has tags
        dynUpdate.tags = []
        if (req.body.tags == []) {
            updateAsset(id, dynUpdate, res)
        } else {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true },
                    function(err, tag) {
                        if (err) return returnErr(err)
                        else {
                            dynUpdate.tags.push(tag);
                            if (index === array.length - 1) updateAsset(id, dynUpdate, res)
                        }
                    });
            })
        }
    } else updateAsset(id, dynUpdate, res)
}

function updateLocation(req, res, id, dynUpdate) {
    if (req.body.location !== undefined) { // If location updated
        if (req.body.location == '') {
            dynUpdate.location = []
            updateTags(req, res, id, dynUpdate)
        } else {
            Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.location = [data._id]
                    updateTags(req, res, id, dynUpdate)
                });
        }
    } else updateTags(req, res, id, dynUpdate)
}

function updateSupplier(req, res, id, dynUpdate) {
    if (req.body.supplier !== undefined) { // If suppleir updated
        if (req.body.supplier == '') {
            dynUpdate.supplier = []
            updateLocation(req, res, id, dynUpdate)
        } else {
            Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.supplier = [data._id]
                    updateLocation(req, res, id, dynUpdate)
                });
        }
    } else updateLocation(req, res, id, dynUpdate)
}

function updateModel(req, res, id, dynUpdate) {
    if (req.body.model !== undefined) { // If model updated
        if (req.body.model == '') {
            dynUpdate.assetModel = []
            updateSupplier(req, res, id, dynUpdate)
        } else {
            Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.assetModel = [data._id]
                    updateSupplier(req, res, id, dynUpdate)
                });
        }
    } else updateSupplier(req, res, id, dynUpdate)
}

function updateCompany(req, res, id, dynUpdate) {
    if (req.body.company !== undefined) { // If company updated
        if (req.body.company == '') {
            dynUpdate.company = []
            updateModel(req, res, id, dynUpdate)
        } else {
            Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.company = [data._id]
                    updateModel(req, res, id, dynUpdate)
                });
        }
    } else updateModel(req, res, id, dynUpdate)
}

function updateManufacturer(req, res, id, dynUpdate) {
    if (req.body.manufacturer !== undefined) { // If manufacturer updated
        if (req.body.manufacturer == '') {
            dynUpdate.manufacturer = []
            updateCompany(req, res, id, dynUpdate)
        } else {
            Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.manufacturer = [data._id]
                    updateCompany(req, res, id, dynUpdate)
                });
        }
    } else updateCompany(req, res, id, dynUpdate)
}

function updateType(req, res, id, dynUpdate) {
    if (req.body.type !== undefined) { // If type updated
        if (req.body.type == '') {
            dynUpdate.type = []
            updateManufacturer(req, res, id, dynUpdate)
        } else {
            Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(err)
                    dynUpdate.type = [data._id]
                    updateManufacturer(req, res, id, dynUpdate)
                });
        }
    } else updateManufacturer(req, res, id, dynUpdate)
}

// Update an asset identified by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    var dynUpdate = {}
    if (req.body.name) { dynUpdate.name = req.body.name }
    if (req.body.quantity) { dynUpdate.quantity = req.body.quantity }
    if (req.body.serial) { dynUpdate.serial = req.body.serial }
    updateType(req, res, id, dynUpdate)
};

// Delete an asset with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

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
};

// Delete all assets from the database.
exports.deleteAll = (req, res) => {
    Asset.deleteMany({})
        .then(data => {
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