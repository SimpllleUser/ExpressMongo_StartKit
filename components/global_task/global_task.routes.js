const authJwt = require("../../middlewares/authJwt")

module.exports = app => {
    const global_task = require("./global_task.controller")
    var router = require("express").Router()
    router.post('/', [authJwt.verifyToken], global_task.create)
    router.get('/:id', [authJwt.verifyToken], global_task.findOne)
    router.put('/:id', [authJwt.verifyToken], global_task.update)
    router.delete('/:id', [authJwt.verifyToken], global_task.delete)
    router.get('/all/:project_id', [authJwt.verifyToken], global_task.findAll)
    router.get('/progress/:id', [authJwt.verifyToken], global_task.getProgerss)

    // router.post('/create-task', global_task.addTask)
    // router.delete('/:id', project.delete)
    // router.get('/tasks', global_task.getTasks)


    app.use("/api/global-task", router);
}