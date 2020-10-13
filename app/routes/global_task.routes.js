module.exports = app => {
    const global_task = require("../controllers/global_task.controller")
    var router = require("express").Router()

    router.post('/', global_task.create)
    router.get('/:project_id', global_task.findAll)
        // router.post('/', global_task.create)
    router.get('/:id', global_task.findOne)
        // router.post('/create-task', global_task.addTask)
        // router.delete('/:id', project.delete)
    router.get('/tasks', global_task.getTasks)
        // router.delete('/delete-task', global_task.deleteTask)
    router.put('/:id', global_task.update)

    app.use("/api/global-task", router);
}