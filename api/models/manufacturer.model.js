module.exports = mongoose => {
    const Manufacturer = mongoose.model(
        "Manufacturer",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Manufacturer;
};