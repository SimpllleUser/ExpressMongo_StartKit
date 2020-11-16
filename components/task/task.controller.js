const { Types } = require('mongoose')
const db = require("../../models");
const Task = db.tasks;
const User = db.user;
const moment = require("moment")
exports.create = async(req, res) => {

    const { globalTaskID, newTask, authorID } = req.body
    if (!globalTaskID || !newTask || !authorID) {
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
        global_taskID: globalTaskID,
        author_UserID: authorID,
        responsible_User: newTask.responsible_User,
        date: newTask.date
    });

    try {
        const ceratedTask = await task.save(task)
        return res.send(ceratedTask);
    } catch (err) {
        return res.status(500).send({
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
    const params = req.body.option || req.body
    const id = req.params.id;
    try {
        const data = await Task.findByIdAndUpdate(id, params, { useFindAndModify: false })
        const date = moment().format('LLL')
        const option = req.body.option && Object.keys(req.body.option)[0]
        const text = `Был сменен ${option}: ${data[option]} => ${req.body.option[option]} `
        const dataUser = await User.findById({ "_id": req.body.author })
        const author = {
            id: dataUser._id,
            name: dataUser.username,
            email: dataUser.email
        }
        await Task.findByIdAndUpdate(id, { $push: { comments: { text, date, author } } }, { useFindAndModify: false })

        data.comments.push({ text, date, author })

        return res.send(data)

    } catch (err) {
        return res.send({
            message: err.message || "Error updating Task with id=" + id
        });
    }
};


exports.setWorkLog = async(req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id
    const { workLog } = req.body
    const params = req.body

    try {
        const data = await Task.findByIdAndUpdate(id, params, { useFindAndModify: false })
        let spentTime = workLog - data.workLog
        const text = `Было потрачено ${spentTime}ч на задачу пользователем`
        const dataUser = await User.findById({ "_id": req.body.author })
        const author = {
            id: dataUser._id,
            name: dataUser.username,
            email: dataUser.email
        }
        const date = new Date().toLocaleDateString()
        await Task.findByIdAndUpdate(id, { $push: { comments: { text, date, author } } }, { useFindAndModify: false })
        data.comments.push({ text, date, author })
        data.workLog = workLog
        spentTime = 0
        return res.send(data)

    } catch (err) {
        return res.send({
            message: err.message || "Error updating Task with id=" + id
        });
    }

}
exports.setOption = async(req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const params = req.body.option
    const id = req.params.id;
    // Object.keys(obj) получить в массиве все свйоства обьекта.
    // Сделать проверку на запись workLog и на наличие  options и id task

    try {
        const data = await Task.findByIdAndUpdate(id, params, { useFindAndModify: false })
        const date = moment().format('LLL')
        const option = req.body.option && Object.keys(req.body.option)[0]
        const text = `Был сменен ${option}: ${data[option]} => ${req.body.option[option]} `
        const dataUser = await User.findById({ "_id": req.body.author })
        const author = {
            id: dataUser._id,
            name: dataUser.username,
            email: dataUser.email
        }
        await Task.findByIdAndUpdate(id, { $push: { comments: { text, date, author } } }, { useFindAndModify: false })

        data.comments.push({ text, date, author })
        data[option] = req.body.option[option]
        return res.send(data);

    } catch (err) {
        return res.send({
            message: err.message || "Error updating Task with id=" + id
        });
    }
}

exports.setUser = async(req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const params = req.body.responsibleUser
    const id = req.params.id;


    try {
        const data = await Task.findByIdAndUpdate(id, params, { useFindAndModify: false })
        const date = moment().format('LLL')
        const option = req.body.option && Object.keys(req.body.option)[0]
        const text = `Был  сменен ответственный пользователь с ${option}: ${data[option]} => ${req.body.option[option]} `
        const dataUser = await User.findById({ "_id": req.body.author })
        const author = {
            id: dataUser._id,
            name: dataUser.username,
            email: dataUser.email
        }
        await Task.findByIdAndUpdate(id, { $push: { comments: { text, date, author } } }, { useFindAndModify: false })

        data.comments.push({ text, date, author })
            // data[option] = req.body.option[option]
        return res.send(data);

    } catch (err) {
        return res.send({
            message: err.message || "Error updating Task with id=" + id
        });
    }
}
exports.delete = async(req, res) => {
    const id = req.body.id;
    try {
        const data = await Task.findByIdAndRemove(id, { useFindAndModify: false })
        if (!data) {
            return res.status(404).send({
                message: `
            Cannot delete Task with id = $ { id }.Maybe Task was not found!`,
                status: false
            });
        }
        return res.send({
            message: "Task was deleted successfully!",
            status: true
        });

    } catch (err) {
        console.log(err)

        res.status(500).send({
            message: err.message || "Could not delete Task with id=" + id,
            status: false
        });
    }

};

exports.setComment = async(req, res) => {
    const { task_id, comment, author } = req.body
    try {

        const user = await User.findById({ '_id': author })
        const newComment = {
            text: comment,
            date: moment().format('LLL'),
            author: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        }

        const task = await Task.findByIdAndUpdate({ '_id': task_id }, { $push: { comments: newComment } }, { useFindAndModify: true })
        task.comments.push(newComment)
        return res.send({ task });
    } catch (err) {
        return res.send({ err });
    }
}

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