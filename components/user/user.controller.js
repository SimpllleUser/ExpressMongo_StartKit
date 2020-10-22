const db = require("../../models");
const User = db.user;
const ProjectUser = db.project_user;
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.getAll = async(req, res) => {
    const { project_id } = req.params;
    try {
        const data = await ProjectUser.find({ "projectID": project_id })
        const usersID = data.map(d => d.userID)
        const resUsers = await User.find({ '_id': { $in: usersID } })
        const users = resUsers.map(u => ({ id: u._id, name: u.username, email: u.email, }))
        return res.send(users)
    } catch (err) {
        return res.status(404).send({ message: err.message || 'Err on querry' })

    }

}
exports.addUser = async(req, res) => {
    const { user_id, project_id } = req.body
        // Check exist user in DB
    try {
        const user = await User.findOne({ "_id": user_id })
        const userOnProject = await ProjectUser.where({ "userID": user.id }, { "projectID": project_id })
        if (userOnProject[0] === undefined) {
            const projectUser = new ProjectUser({ projectID: project_id, userID: user_id })
            await projectUser.save(projectUser)
            return res.send({ id: user.id, name: user.name, email: user.email })
        } else {
            return res.status(500).send({ message: "This user exist on this project" })
        }
    } catch (err) {
        return res.status(404).send({ message: `Users with ID ${user_id} not found !` })
    }


}

exports.deleteFromProject = async(req, res) => {
    const { project_id, user_id } = req.body;
    try {
        await ProjectUser.remove({ "projectID": project_id, "userID": user_id })
        return res.status(200).send({ message: "ok" })
    } catch (err) {
        return res.status(404).send({ message: err.message || 'Err on querry' })

    }

}