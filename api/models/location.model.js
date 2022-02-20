module.exports = mongoose => {
    const Location = mongoose.model(
        "Location",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Location;
};