const { Types } = require('mongoose')
const { project } = require("../../models")
const db = require("../../models")

const Project = db.project
const ProjectUser = db.project_user
exports.creaet = async(req, res) => {
    const { title, description, user_id } = req.body

    if (!title) {
        return res.status(400).send({ message: "Content can not be empty!" })
    }

    const project = new Project({
        title,
        description,
        user_id
    })

    try {
        const newProject = await project.save(project)
        const project_user = new ProjectUser({ projectID: newProject.id, userID: user_id })
        await project_user.save(project_user)
        res.send(project)
    } catch (err) {
        return res.send({ message: err.message || "Some error occurred while creating the Project." })
    }


}

exports.findAll = async(req, res) => {
    // const { title, description } = req.body
    // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    try {
        const projects = await Project.find({})
        return res.send(projects)
    } catch (err) {
        return res.status(500).send({ message: err.message || "Some error occurred while retrieving projects." })
    }
}

exports.allData = async(req, res) => {

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
        res.send(project);

    } catch (err) {
        res.send({ message: err.message || "Some err with get project" });
    }
}


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


exports.getProjectsUser = async(req, res) => {
    const { id } = req.params;
    try {
        const projectsUser = await ProjectUser.find({ "userID": id })
        const projectsId = projectsUser.map(item => item.projectID)
        const projects = await Project.find({ '_id': { $in: projectsId } })
        return res.send(projects)
    } catch (err) {

    }

}