const project = require("./project.controller")
const authJwt = require("../../middlewares/authJwt")

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
    router.post('/', [authJwt.verifyToken], project.creaet)
    router.get('/', [authJwt.verifyToken], project.findAll)
    router.get('/:id', [authJwt.verifyToken], project.findOne)
    router.get('/allData/:id', [authJwt.verifyToken], project.allData)
    router.get('/progress/:id', [authJwt.verifyToken], project.getProgress)
    router.get('/users/:id', [authJwt.verifyToken], project.getProjectsUser)
    router.put('/:id', [authJwt.verifyToken], project.update)
    router.delete('/:id', [authJwt.verifyToken], project.delete)

    app.use("/api/project", router);
}