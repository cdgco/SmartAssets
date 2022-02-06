module.exports = mongoose => {
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const uniqueValidator = require('mongoose-unique-validator');
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
    }, { timestamps: true, _id: false });

    schema.plugin(AutoIncrement);
    schema.plugin(uniqueValidator);

    const Asset = mongoose.model("asset", schema);

    return Asset;
};