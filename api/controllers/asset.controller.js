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
const Papa = require('papaparse');
const { manufacturer } = require("../models");
const { model } = require("mongoose");
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
        if (error) return returnErr(res, error)
        else return returnSuccess(res, asset)
    });
}

function createTags(asset, req, res) {
    if (req.body.tags) { // If asset has tags
        if (req.body.tags.length > 0) {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true },
                    function(err, tag) {
                        if (err) return returnErr(res, err)
                        else {
                            asset.tags.push(tag);
                            if (index === array.length - 1) createAsset(asset, res)
                        }
                    });

            })
        } else createAsset(asset, res)
    } else createAsset(asset, res)
}

function createLocation(asset, req, res) {
    if (req.body.location) { // If asset has location
        Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location }, { new: true, upsert: true },
            function(err, location) {
                if (err) return returnErr(res, err)
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
                if (err) return returnErr(res, err)
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
                if (err) return returnErr(res, err)
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
                if (err) return returnErr(res, err)
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
                if (err) return returnErr(res, err)
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
                if (err) return returnErr(res, err)
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
        if (req.body.tags.length == 0) {
            updateAsset(id, dynUpdate, res)
        } else {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true },
                    function(err, tag) {
                        if (err) return returnErr(res, err)
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
                    if (err) return returnErr(res, err)
                    dynUpdate.location = [data._id]
                    updateTags(req, res, id, dynUpdate)
                });
        }
    } else updateTags(req, res, id, dynUpdate)
}

function updateSupplier(req, res, id, dynUpdate) {
    if (req.body.supplier !== undefined) { // If supplier updated
        if (req.body.supplier == '') {
            dynUpdate.supplier = []
            updateLocation(req, res, id, dynUpdate)
        } else {
            Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier }, { new: true, upsert: true },
                function(err, data) {
                    if (err) return returnErr(res, err)
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
                    if (err) return returnErr(res, err)
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
                    if (err) return returnErr(res, err)
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
                    if (err) return returnErr(res, err)
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
                    if (err) return returnErr(res, err)
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

function insertAsset(asset, res) {
    asset.save((error, asset) => {
        if (error) res.push(error)
    });
}

function insertTags(asset, req, res) {
    if (req.body.tags) { // If asset has tags
        if (req.body.tags.length > 0) {
            req.body.tags.forEach(function(tag, index, array) {
                Tags.findOneAndUpdate({ name: tag }, { name: tag }, { new: true, upsert: true },
                    function(err, tag) {
                        if (err) res.push(err)
                        else {
                            asset.tags.push(tag);
                            if (index === array.length - 1) insertAsset(asset, res)
                        }
                    });

            })
        } else insertAsset(asset, res)
    } else insertAsset(asset, res)
}

function insertLocation(asset, req, res) {
    if (req.body.location) { // If asset has location
        Location.findOneAndUpdate({ name: req.body.location }, { name: req.body.location }, { new: true, upsert: true },
            function(err, location) {
                if (err) res.push(err)
                else {
                    asset.location.push(location);
                    insertTags(asset, req, res)
                }
            });
    } else insertTags(asset, req, res)
}

function insertSupplier(asset, req, res) {
    if (req.body.supplier) { // If asset has supplier
        Supplier.findOneAndUpdate({ name: req.body.supplier }, { name: req.body.supplier }, { new: true, upsert: true },
            function(err, supplier) {
                if (err) res.push(err)
                else {
                    asset.supplier.push(supplier);
                    insertLocation(asset, req, res)
                }
            });
    } else insertLocation(asset, req, res)
}

function insertModel(asset, req, res) {
    if (req.body.model) { // If asset has model
        Model.findOneAndUpdate({ name: req.body.model }, { name: req.body.model }, { new: true, upsert: true },
            function(err, model) {
                if (err) res.push(err)
                else {
                    asset.assetModel.push(model);
                    insertSupplier(asset, req, res)
                }
            });
    } else insertSupplier(asset, req, res)
}

function insertCompany(asset, req, res) {
    if (req.body.company) { // If asset has company
        Company.findOneAndUpdate({ name: req.body.company }, { name: req.body.company }, { new: true, upsert: true },
            function(err, company) {
                if (err) res.push(err)
                else {
                    asset.company.push(company);
                    insertModel(asset, req, res)
                }
            });
    } else insertModel(asset, req, res)
}

function insertManufacturer(asset, req, res) {
    if (req.body.manufacturer) { // If asset has manufacturer
        Manufacturer.findOneAndUpdate({ name: req.body.manufacturer }, { name: req.body.manufacturer }, { new: true, upsert: true },
            function(err, manufacturer) {
                if (err) res.push(err)
                else {
                    asset.manufacturer.push(manufacturer);
                    insertCompany(asset, req, res)
                }
            });
    } else insertCompany(asset, req, res)
}

function insertType(asset, req, res) {
    if (req.body.type) { // If Asset has type
        Type.findOneAndUpdate({ name: req.body.type }, { name: req.body.type }, { new: true, upsert: true },
            function(err, type) {
                if (err) res.push(err)
                else {
                    asset.type.push(type);
                    insertManufacturer(asset, req, res)
                }
            });
    } else insertManufacturer(asset, req, res)
}

exports.importCSV = (req, res) => {
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