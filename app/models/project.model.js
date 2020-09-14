const mongoose = require("mongoose");

const Project = mongoose.model(
    "Project",
    new mongoose.Schema({
        title: String,
        description: String,
    }, { timestamps: true })
);

module.exports = Project;