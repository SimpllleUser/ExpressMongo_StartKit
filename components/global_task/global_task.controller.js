const { global_task } = require("../../models")
const db = require("../../models")

const Task = db.tasks
const GlobalTask = db.global_task

exports.create = async(req, res) => {

    const { title, description, project_id } = req.body.global_task;

    !title && res.status(400).send({ message: "Content can not be empty!" })

    const global_task = new GlobalTask({
        title,
        description,
        projectID: project_id
    })

    try {
        const data = await global_task.save(global_task)
        return res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the GlobalTask."
        });
    }
}


exports.findAll = async(req, res) => {
    const { project_id } = req.params

    try {
        const global_tasks = await GlobalTask.find({ projectID: project_id })
        return res.send(global_tasks)
    } catch (err) {
        return res.status(500).send({ message: err.message || "Some error occurred while retrieving global_tasks." })
    }
}

exports.findOne = async(req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }
    try {
        const global_task = await GlobalTask.findById(id)
        res.send(global_task);
    } catch (err) {
        res.status(500).send.message({ message: "Error retrieving Task with id=" + id })
    }
}

exports.update = async(req, res) => {
    if (!req.body) { return res.status(404).send({ message: "Data to update can not be empty!" }) }

    const id = req.params.id

    GlobalTask.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update GlobalTask with id=${id}. Maybe GlobalTask was not found!` })
            } else res.send({ message: "GlobalTask was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating GlobalTask with id=" + id })
        })
}
exports.delete = async(req, res) => {

    const id = req.body

    try {
        await GlobalTask.findOneAndRemove(id, { useFindAndModify: false })
        res.send({ message: "Delete success" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err || " Can`t delete task by id=" + task_id })
    }
}