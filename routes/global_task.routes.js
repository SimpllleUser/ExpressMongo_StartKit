module.exports = app => {
    const global_task = require("../components/global_task/global_task.controller")
    var router = require("express").Router()
    router.get('/:id', global_task.findOne)
    router.post('/', global_task.create)
    router.get('/all/:project_id', global_task.findAll)
        // router.post('/', global_task.create)
        // router.post('/create-task', global_task.addTask)
        // router.delete('/:id', project.delete)
    router.get('/tasks', global_task.getTasks)
        // router.delete('/delete-task', global_task.deleteTask)
    router.put('/:id', global_task.update)

    app.use("/api/global-task", router);
}