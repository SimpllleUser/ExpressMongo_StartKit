const { project } = require("../models")
const { Types } = require('mongoose')
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

exports.allData = async(req, res) => {

    const id = req.params.id;
    // if (!id) {
    //     return res.status(404).send('Contecnt can`t be empty')
    // }
    try {
        const project = await Project.findById(id)
        let global_tasks = await GlobalTask.find({ '_id': { $in: project.global_tasks } })

        let tasks = []
        global_tasks.forEach(g_task => tasks = [...tasks, ...g_task.tasks])
        return res.send(global_tasks)

        const allTasks = await Task.find().where('_id', tasks)

        return res.send({ tasks: allTasks, global_tasks })
    } catch (e) {
        return res.send({ message: e.message })
    }
}



exports.findOne = async(req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(404).send({ message: "Not found Proejct with" + id });
    }

    try {
        const project = await Project.findById(id)
        let global_tasks = await GlobalTask.find({ '_id': { $in: project.global_tasks } })
        global_tasks = JSON.parse(JSON.stringify(global_tasks).replace(/_id/gi, 'id')) // Замена _id на id
        project.global_tasks = global_tasks
        res.send(project);

    } catch (err) {
        res.send({ message: err.message || "Some err with get project" });
    }
}

//     .then(data => {
//             if (data) {
//                 res.send(data)
//             } else {
//                 res.status(404).send({ message: "Not found Task with id " + id })
//             }
//         })
//         .catch(err => {
//             res.status(500).send.message({ message: "Error retrieving Task with id=" + id })
//         })
// }


exports.update = (req, res) => {
    if (!req.body) { return res.status(404).send({ message: "Data to update can not be empty!" }) }

    const id = req.params.id

    Project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update Project with id=${id}. Maybe Task was not found!` })
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

    const { id, global_task } = req.body.id

    if (!id && !global_task) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }

    const newGobal_task = new GlobalTask({
        title: global_task.title,
        description: global_task.description
    })
    try {
        // .toString()
        const newGlobalTask = await newGobal_task.save(newGobal_task)
        await Project.findByIdAndUpdate({ _id: id }, { $push: { global_tasks: newGlobalTask._id } }, { useFindAndModify: false })
        res.send(newGlobalTask)
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
        await Project.findByIdAndUpdate({ _id: id }, { $pull: { global_tasks: Types.ObjectId(global_taskId) } }, { useFindAndModify: false })
        await GlobalTask.findByIdAndRemove(global_taskId, { useFindAndModify: false })
        res.send({ message: "Delete success" });
    } catch (err) {
        res.status(500).send({ message: err || " Can`t delete task by id=" + task_id })
    }
}