const mongoose = require("mongoose");

const GlobalTask = mongoose.model(
    "GlobalTask",
    new mongoose.Schema({
        name: String,
        description: String,
        tasks: []
    })
);

module.exports = GlobalTask;