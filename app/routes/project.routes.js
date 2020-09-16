module.exports = app => {
    const project = require("../controllers/project.controller")
    var router = require("express").Router()

    router.post('/', project.creaet)
    router.get('/', project.findAll)
    router.get('/:id', project.findOne)
    router.put('/:id', project.update)
    router.delete('/:id', project.delete)
    router.post('/create/global-task', project.createGlobalTask)
    router.delete('/delete/global-task', project.deleteGlobalTask)


    app.use("/api/project", router);
}