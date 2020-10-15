module.exports = app => {
    const calendarEvents = require("./calendar.controller");

    var router = require("express").Router();

    // Create a new CalendarEvent
    router.post("/", calendarEvents.create);

    // Retrieve all CalendarEvents
    router.get("/", calendarEvents.findAll);

    // Retrieve a single CalendarEvent with id
    router.get("/:id", calendarEvents.findOne);

    // Update a CalendarEvent with id
    router.put("/:id", calendarEvents.update);

    // Delete a CalendarEvent with id
    router.delete("/:id", calendarEvents.delete);

    // Create a new CalendarEvent
    router.delete("/", calendarEvents.deleteAll);

    app.use("/api/calendar-event", router);
};