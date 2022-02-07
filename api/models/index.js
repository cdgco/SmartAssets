const dbConfig = require("../../db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.connectionString + "/" + dbConfig.dbName;
db.assets = require("./asset.model.js")(mongoose);
db.users = require("./user.model.js")(mongoose);
db.roles = require("./role.model.js")(mongoose);
db.company = require("./company.model.js")(mongoose);
db.manufacturer = require("./manufacturer.model.js")(mongoose);
db.model = require("./model.model.js")(mongoose);
db.supplier = require("./supplier.model.js")(mongoose);
db.tag = require("./tag.model.js")(mongoose);
db.type = require("./type.model.js")(mongoose);

module.exports = db;