const { project } = require("../models")
const db = require("../models")

const Project = db.project
const GlobalTask = db.global_task
exports.creaet = (req, res) => {
    const { title, description } = req.body


    if (!title) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }


    const project = new Project({
        title,
        description
    })

    project
        .save(project)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Project."
            });
        });

}

exports.findAll = (req, res) => {
    const { title, description } = req.body
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Project.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving projects." })
        })

}

exports.findOne = (req, res) => {
    const id = req.params.id
    Project.findById(id)
        .then(data => {
            if (data) {
                res.send(data)
            } else {
                res.status(404).send({ message: "Not found Task with id " + id })
            }
        })
        .catch(err => {
            res.status(500).send.message({ message: "Error retrieving Task with id=" + id })
        })
}

exports.update = (req, res) => {
    if (!req.body) { return res.status(404).send({ message: "Data to update can not be empty!" }) }

    const id = req.params.id

    Project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update Task with id=${id}. Maybe Task was not found!` })
            } else res.send({ message: "Project was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating Task with id=" + id })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Project.findByIdAndDelete(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Project with id=${id}. Maybe Task was not found!`,
                    status: false
                })
            } else {
                res.send({
                    message: "Project was deleted successfully!",
                    status: true
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Task with id=" + id,
                status: false
            })
        })
};

exports.createGlobalTask = async(req, res) => {

    const { id, global_task } = req.body

    if (!id && !global_task) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }

    const newGobal_task = new GlobalTask({
        title: global_task.title,
        description: global_task.description
    })
    try {
        const response = await newGobal_task.save(newGobal_task)
        const result_create = await Project.findByIdAndUpdate({ _id: id }, { $push: { global_tasks: response._id.toString() } }, { useFindAndModify: false })
        res.send(result_create)
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the GlobalTask."
        });
    }
}

exports.deleteGlobalTask = async(req, res) => {
    const { id, global_taskId } = req.body

    if (!id && !global_taskId) {
        return res.status(400).send({ message: "Content can not find!" })
    }

    try {
        await Project.findByIdAndUpdate({ _id: id }, { $pull: { global_tasks: global_taskId } }, { useFindAndModify: false })
        await GlobalTask.findByIdAndRemove(task_id, { useFindAndModify: false })
            // TODO Добавить подобній функционал для task.controller
        res.send({ message: "Delete success" });
    } catch (err) {
        res.status(500).send({ message: err || " Can`t delete task by id=" + task_id })
    }
}