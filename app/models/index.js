const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tasks = require("./task.model.js")(mongoose);
db.calendar_events = require("./calendar.model.js")(mongoose);

db.user = require("./user.model")
db.user = require("./role.model")

db.ROLE = ["user", "admin", "moderator"]

module.exports = db;