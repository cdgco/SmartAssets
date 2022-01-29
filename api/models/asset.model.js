module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        published: Boolean
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Asset = mongoose.model("asset", schema);
    return Asset;
};