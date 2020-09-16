module.exports = app => {
    const tasks = require("../controllers/task.controller.js");

    var router = require("express").Router();

    // Create a new Task
    router.post("/", tasks.create);

    // Retrieve all Tasks
    router.get("/", tasks.findAll);

    // Retrieve all published Tasks
    router.get("/published", tasks.findAllPublished);

    // Retrieve a single Task with id
    router.get("/id=:id", tasks.findOne);

    // Update a Task with id
    router.put("/:id", tasks.update);

    // Update work-log a Task with id
    router.put("/work-log/:id", tasks.update);

    // Delete a Task with id
    router.delete("/:id", tasks.delete);

    // Create a new Task
    router.delete("/", tasks.deleteAll);

    router.get("/global-task", tasks.findGlobalTask);


    app.use("/api/tasks", router);
};