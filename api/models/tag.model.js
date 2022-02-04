module.exports = mongoose => {
    const Tag = mongoose.model(
        "Tag",
        mongoose.Schema({
            name: String,
        }, { timestamps: true })
    );
    return Tag;
};