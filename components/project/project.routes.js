const project = require("./project.controller")

module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    var router = require("express").Router()
        // ! Add middle ware
    router.post('/', project.creaet)
    router.get('/', project.findAll)
    router.get('/:id', project.findOne)
    router.get('/allData/:id', project.allData)
    router.get('/progress/:id', project.getProgress)
    router.get('/users/:id', project.getProjectsUser)
    router.put('/:id', project.update)
    router.delete('/:id', project.delete)

    app.use("/api/project", router);
}