module.exports = mongoose => {
    const uniqueValidator = require('mongoose-unique-validator');
    var schema = mongoose.Schema({
        name: {
            type: String,
            unique: true,
        },
        count: Number
    }, { timestamps: false })

    schema.plugin(uniqueValidator);
    const Supplier = mongoose.model("Supplier", schema);
    return Supplier;
};