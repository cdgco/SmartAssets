module.exports = mongoose => {
    const Supplier = mongoose.model(
        "Supplier",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Supplier
};