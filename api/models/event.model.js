module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        user: String,
        asset: String,
        type: String,
        color: String
    }, { timestamps: true })

    const Event = mongoose.model("Event", schema);
    return Event;
};