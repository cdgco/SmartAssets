module.exports = mongoose => {
    const uniqueValidator = require('mongoose-unique-validator');
    const User = mongoose.model(
        "User",
        mongoose.Schema({
            username: {
                type: String,
                unique: true,
            },
            email: {
                type: String,
                unique: true,
            },
            password: String,
            roles: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }],
            name: String,
            phone: String,
            location: String,
            title: String
        }, { timestamps: true })
    );
    return User;
};