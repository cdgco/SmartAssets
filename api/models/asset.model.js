module.exports = mongoose => {
    var schema = mongoose.Schema({
        name: String,
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
        model: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Model"
        }],
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }],
        id: String,
        customFields: {}
    }, { timestamps: true });

    const Asset = mongoose.model("asset", schema);
    return Asset;
};