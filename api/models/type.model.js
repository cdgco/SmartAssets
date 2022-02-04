module.exports = mongoose => {
    const Type = mongoose.model(
        "Type",
        mongoose.Schema({
            name: String,
        }, { timestamps: true })
    );
    return Type;
};