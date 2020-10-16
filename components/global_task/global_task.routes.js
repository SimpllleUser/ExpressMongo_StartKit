module.exports = app => {
    const global_task = require("./global_task.controller")
    var router = require("express").Router()
    router.post('/', global_task.create)
    router.get('/:id', global_task.findOne)
    router.put('/:id', global_task.update)
    router.delete('/:id', global_task.delete)
    router.get('/all/:project_id', global_task.findAll)
        // router.post('/create-task', global_task.addTask)
        // router.delete('/:id', project.delete)
        // router.get('/tasks', global_task.getTasks)


    app.use("/api/global-task", router);
}