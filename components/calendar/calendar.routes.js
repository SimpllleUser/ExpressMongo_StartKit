module.exports = app => {
    const calendarEvents = require("./calendar.controller");

    var router = require("express").Router();

    router.post("/", calendarEvents.create);
    router.get("/all/:user_id", calendarEvents.findAll);
    router.get("/:id", calendarEvents.findOne);
    router.put("/:id", calendarEvents.update);
    router.delete("/:id", calendarEvents.delete);
    router.delete("/", calendarEvents.deleteAll);

    app.use("/api/calendar-event", router);
};