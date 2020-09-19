const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tasks = require("./task.model.js")(mongoose)
db.calendar_events = require("./calendar.model.js")(mongoose)
db.project = require("./project.model")(mongoose)
db.user = require("./user.model")
db.role = require("./role.model")
db.global_task = require("./global_task.model")(mongoose)

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;