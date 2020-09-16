const { global_task } = require("../models")
const db = require("../models")

const Task = db.tasks
const GlobalTask = db.global_task

exports.create = (req, res) => {
    const { title, description } = req.body


    if (!title) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }


    const global_task = new GlobalTask({
        title,
        description
    })

    global_task
        .save(global_task)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the GlobalTask."
            });
        });

}


exports.findAll = (req, res) => {
    const { title, description } = req.body
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    GlobalTask.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving global_tasks." })
        })

}

exports.findOne = (req, res) => {
    const id = req.params.id
    GlobalTask.findById(id)
        .then(data => {
            if (data) {
                res.send(data)
            } else {
                res.status(404).send({ message: "Not found Global_task with id " + id })
            }
        })
        .catch(err => {
            res.status(500).send.message({ message: "Error retrieving Task with id=" + id })
        })
}


exports.update = (req, res) => {
    if (!req.body) { return res.status(404).send({ message: "Data to update can not be empty!" }) }

    const id = req.params.id

    GlobalTask.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update GlobalTask with id=${id}. Maybe Task was not found!` })
            } else res.send({ message: "Project was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating GlobalTask with id=" + id })
        })
}

exports.addTask = (req, res) => {

    if (!req.body) { return res.status(404).send({ message: "Data to update can not be empty!" }) }

    const { id, task_id } = req.body

    GlobalTask.findByIdAndUpdate({ _id: id }, { $push: { tasks: task_id } })
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log("ERR => ", err))
}

exports.getTasks = async(req, res) => {
    try {
        const test = "5f608fbe685ba90df44e66f4"
        const globalTask = await GlobalTask.findById(test)
        const tasksId = globalTask.tasks;

        const tasks = await Task.find({
            '_id': { $in: tasksId }
        });
        return res.send(tasks);
    } catch (err) {
        res.status(404).send({ message: err })
    }
}