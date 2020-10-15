const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tasks = require("../components/calendar/calendar.model")(mongoose)
db.calendar_events = require("../components/calendar/calendar.model")(mongoose)
db.project = require("../components/project/project.model")(mongoose)
db.user = require("../components/user/user.model")
db.role = require("../models/role.model")
db.global_task = require("../components/global_task/global_task.model")(mongoose)
db.project_user = require("../components/project/project.model")(mongoose)

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;