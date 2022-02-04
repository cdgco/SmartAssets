module.exports = mongoose => {
    const Model = mongoose.model(
        "Model",
        mongoose.Schema({
            name: String,
        }, { timestamps: true })
    );
    return Model;
};