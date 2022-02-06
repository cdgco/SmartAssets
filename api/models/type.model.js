module.exports = mongoose => {
    const Type = mongoose.model(
        "Type",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Type;
};