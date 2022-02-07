module.exports = mongoose => {
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const uniqueValidator = require('mongoose-unique-validator');
    const mexp = require('mongoose-elasticsearch-xp').v7;
    const elasticConfig = require("../../elastic.config.js");
    var schema = mongoose.Schema({
        _id: Number,
        name: {
            type: String,
            unique: true,
        },
        quantity: String,
        location: String,
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Type"
        }],
        manufacturer: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manufacturer"
        }],
        supplier: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier"
        }],
        company: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }],
        serial: String,
        assetModel: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Model"
        }],
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }],
        customFields: {}
    }, {
        es_extend: {
            id: {
                es_type: 'string',
                es_value: function(document) {
                    return document._id;
                }
            }
        },
        timestamps: true,
        _id: false
    });

    schema.plugin(AutoIncrement);
    schema.plugin(uniqueValidator);
    var elasticCredential = (elasticConfig.username != '' || elasticConfig.password != '') ? (elasticConfig.username + ":" + elasticConfig.password) : ''
    schema.plugin(mexp, {
        "host": elasticConfig.host,
        "port": elasticConfig.port,
        "auth": elasticCredential,
        "protocol": elasticConfig.protocol
    });

    const Asset = mongoose.model("asset", schema);

    return Asset;
};