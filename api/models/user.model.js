module.exports = mongoose => {
    const User = mongoose.model(
        "User",
        mongoose.Schema({
            username: String,
            email: String,
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