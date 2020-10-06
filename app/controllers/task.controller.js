const db = require("../models");
const Task = db.tasks;
const GlobalTask = db.global_task
const Project = db.project
const { Types } = require('mongoose')


// Create and Save a new Task
exports.create = (req, res) => {
    // Validate request

    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Task
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        type: req.body.type,
        priority: req.body.priority,
        workLog: 0,
        estimate: req.body.estimate,
        date: req.body.date
            // published: req.body.published ? req.body.published : false
    });

    // Save Task in the database
    task
        .save(task)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Task."
            });
        });
};

// Retrieve all Tasks from the database.
exports.findAll = async(req, res) => {

    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};


    const id = req.params.id;
    if (!id) {
        return res.status(404).send('Contecnt can`t be empty')
    }

    try {
        const project = await Project.findById(id)
        let global_tasks = await GlobalTask.find({ '_id': { $in: project.global_tasks } })
        let tasks = []
        global_tasks.forEach(g_task => tasks = [...tasks, ...g_task.tasks])
        const allTasks = await Task.find().where('_id', tasks)
        return res.send(allTasks)
    } catch (e) {
        return res.send({ message: e.message })

    }

    Task.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks."
            });
        });
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
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Task with id=${id}. Maybe Task was not found!`
                });
            } else res.send({ message: "Task was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Task with id=" + id
            });
        });
};

// Delete a Task with the specified id in the request
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

// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
    Task.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tasks were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tasks."
            });
        });
};

// Find all published Tasks
exports.findAllPublished = (req, res) => {
    Task.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks."
            });
        });
};
exports.findGlobalTask = async(req, res) => {
    const id = req.body.id;
    try {
        const globalTask = await GlobalTask.findById(id)
        return res.send(globalTask);
    } catch (err) {
        res.status(404).send({ message: err || "Not found Global_task with id" })
    }

}

exports.createInGlobal_task = async(req, res) => {
    const id = req.body.id

    const { title, description, status, type, priority, workLog, estimate, date } = req.body.task

    if (!title && !description) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const task = new Task({
        title,
        description,
        status: "Open",
        type,
        priority,
        workLog: 0,
        estimate,
        date
    });

    try {
        const result = await task.save(task)
        await GlobalTask.findByIdAndUpdate({ _id: id }, { $push: { tasks: result._id } }, { useFindAndModify: false })
        res.send(result)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }


}

exports.deleteInGlobal_task = async(req, res) => {
    const { id, taskId } = req.body
    if (!id && !taskId) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }
    try {
        await GlobalTask.findByIdAndUpdate({ _id: id }, { $pull: { tasks: Types.ObjectId(taskId) } }, { useFindAndModify: false })
        await Task.findByIdAndRemove(taskId, { useFindAndModify: false })
        res.send("ok");
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}