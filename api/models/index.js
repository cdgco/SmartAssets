const dbConfig = require("../../db.config.js");

const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.assets = require("./asset.model.js")(mongoose);
db.users = require("./user.model.js")(mongoose);
db.roles = require("./role.model.js")(mongoose);

module.exports = db;