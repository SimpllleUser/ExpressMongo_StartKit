const { Types } = require('mongoose')
const db = require("../../models");
const Task = db.tasks;
const GlobalTask = db.global_task

exports.create = async(req, res) => {

    const { global_taskID, newTask, author_UserID } = req.body

    if (!global_taskID || !global_taskID || !global_taskID) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const task = new Task({
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        type: newTask.type,
        priority: newTask.priority,
        workLog: 0,
        estimate: newTask.estimate,
        global_taskID,
        author_UserID,
        date: newTask.date
    });

    try {
        const ceratedTask = await task.save(task)
        res.send(ceratedTask);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Task."
        });
    }
};

// Retrieve all Tasks from the database.
exports.findAll = async(req, res) => {

    const global_taskID = req.params.global_taskID;
    if (!global_taskID) {
        return res.status(404).send('Contecnt can`t be empty')
    }
    try {
        const tasks = await await Task.find({ global_taskID })
        return res.send(tasks)
    } catch (e) {
        return res.send({ message: e.message })
    }

};

// Find a single Task with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Task.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Task with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Task with id=" + id });
        });
};

// Update a Task by the id in the request
exports.update = async(req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    try {
        const data = await Task.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
        if (!data) {
            res.status(404).send({
                message: `Cannot update Task with id=${id}. Maybe Task was not found!`
            });
        }
        return res.send(data)
    } catch (err) {
        return res.status(500).send({
            message: "Error updating Task with id=" + id
        });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Task.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Task with id=${id}. Maybe Task was not found!`,
                    status: false
                });
            } else {
                res.send({
                    message: "Task was deleted successfully!",
                    status: true
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Task with id=" + id,
                status: false
            });
        });
};

exports.getAllFromGlobalTasks = async(req, res) => {
    const global_tasks = Object.values(req.query)[0];

    if (!global_tasks) {
        return res.status(404).send({ message: "Empty" })
    }

    try {
        const tasks = await Task.find({ 'global_taskID': { $in: global_tasks } })
        return res.send(tasks)
    } catch (err) {
        return res.send(err)
    }
}