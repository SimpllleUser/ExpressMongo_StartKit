const { request } = require("express");
const authJwt = require("../../middlewares/authJwt")

module.exports = app => {
    const tasks = require("./task.controller");
    const router = require("express").Router();
    router.post("/", tasks.create);
    router.get("/all/:global_taskID", tasks.findAll);

    router.get("/id=:id", [authJwt.verifyToken], tasks.findOne);
    router.put("/:id", [authJwt.verifyToken], tasks.update);
    router.put("/work-log/:id", [authJwt.verifyToken], tasks.setWorkLog);
    router.put("/option/:id", [authJwt.verifyToken], tasks.setOption);
    router.post("/comment", [authJwt.verifyToken], tasks.setComment);
    router.delete("/:id", [authJwt.verifyToken], tasks.delete);
    router.get("/all-tasks/from/globlal-tasks", [authJwt.verifyToken], tasks.getAllFromGlobalTasks)
    app.use("/api/tasks", router);
};