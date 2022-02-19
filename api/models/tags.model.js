module.exports = mongoose => {
    const Tags = mongoose.model(
        "Tags",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Tags;
};