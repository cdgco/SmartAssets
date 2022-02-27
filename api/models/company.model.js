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
    const Company = mongoose.model("Company", schema);
    return Company;
};