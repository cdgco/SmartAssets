module.exports = mongoose => {
    const uniqueValidator = require('mongoose-unique-validator');
    var schema = mongoose.Schema({
        name: {
            type: String,
            unique: true,
        },
    }, { timestamps: false })

    schema.plugin(uniqueValidator);
    const Manufacturer = mongoose.model("Manufacturer", schema);
    return Manufacturer;
};