module.exports = app => {
    const tasks = require("./task.controller");
    var router = require("express").Router();
    router.post("/", tasks.create);
    router.get("/all/:global_taskID", tasks.findAll);
    router.get("/id=:id", tasks.findOne);
    router.put("/:id", tasks.update);
    router.put("/work-log/:id", tasks.setWorkLog);
    router.put("/option/:id", tasks.setOption);
    router.delete("/:id", tasks.delete);
    router.get("/all-tasks/from/globlal-tasks", tasks.getAllFromGlobalTasks)
    app.use("/api/tasks", router);
};