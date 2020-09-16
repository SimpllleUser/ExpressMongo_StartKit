const mongoose = require("mongoose");

const Project = mongoose.model(
    "Project",
    new mongoose.Schema({
        title: String,
        description: String,
        global_tasks: []
    }, { timestamps: true })
);

module.exports = Project;