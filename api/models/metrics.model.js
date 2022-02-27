module.exports = mongoose => {
    var schema = mongoose.Schema({
        name: {
            type: String,
            unique: true,
        },
        data: Array,
    }, { timestamps: true })

    const Metrics = mongoose.model("Metrics", schema);
    return Metrics;
};