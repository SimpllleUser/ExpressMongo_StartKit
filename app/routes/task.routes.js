module.exports = app => {
    const tasks = require("../controllers/task.controller.js");
    var router = require("express").Router();
    router.post("/", tasks.create);
    // router.get("/", tasks.findAll);
    router.get("/published", tasks.findAllPublished);
    router.get("/id=:id", tasks.findOne);
    router.put("/:id", tasks.update);
    router.put("/work-log/:id", tasks.update);
    router.delete("/:id", tasks.delete);
    router.delete("/", tasks.deleteAll);
    router.get("/global-task", tasks.findGlobalTask);
    router.get("/all_tasks/:id", tasks.findAll)

    router.post("/create/in_global-task", tasks.createInGlobal_task);
    router.delete("/delete/in_global-task", tasks.deleteInGlobal_task);

    app.use("/api/tasks", router);
};