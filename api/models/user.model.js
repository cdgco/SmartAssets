module.exports = mongoose => {
    var schema = mongoose.Schema({
        username: String,
        email: String,
        name: String,
        password: String,
        admin: Boolean,
        api: String,
        picture: String,
        phone: String,
        location: String,
        title: String
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("user", schema);
    return User;
};