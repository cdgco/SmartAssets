module.exports = mongoose => {
    const Tag = mongoose.model(
        "Tag",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Tag;
};