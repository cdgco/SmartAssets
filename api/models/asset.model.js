module.exports = mongoose => {
    var schema = mongoose.Schema({
        name: String,
        description: String,
        published: Boolean,
        id: String
    }, { timestamps: true });

    const Asset = mongoose.model("asset", schema);
    return Asset;
};