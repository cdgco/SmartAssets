module.exports = mongoose => {
    const Company = mongoose.model(
        "Company",
        mongoose.Schema({
            name: String,
        }, { timestamps: true })
    );
    return Company;
};