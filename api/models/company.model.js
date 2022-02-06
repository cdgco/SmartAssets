module.exports = mongoose => {
    const Company = mongoose.model(
        "Company",
        mongoose.Schema({
            name: String,
        }, { timestamps: false })
    );
    return Company;
};