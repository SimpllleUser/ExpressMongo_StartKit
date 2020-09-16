module.exports = app => {
    const global_task = require("../controllers/global_task.controller")
    var router = require("express").Router()

    router.post('/', global_task.create)
    router.get('/', global_task.findAll)
        // router.get('/:id', global_task.findOne)
    router.post('/addTask', global_task.addTask)
    router.get('/tasks', global_task.getTasks)

    // router.put('/:id', project.update)
    // router.delete('/:id', project.delete)

    app.use("/api/global_task", router);
}