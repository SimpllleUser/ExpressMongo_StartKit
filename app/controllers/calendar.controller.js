const db = require("../models");
const CalendarEvent = db.calendar_events;



exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a CalendarEvent
    const calendarEvent = new CalendarEvent({
        title: req.body.title,
        date: req.body.date
            // published: req.body.published ? req.body.published : false
    });

    // Save CalendarEvent in the database
    calendarEvent
        .save(calendarEvent)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the CalendarEvent."
            });
        });
};

// Retrieve all CalendarEvents from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    CalendarEvent.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks."
            });
        });
};

// Find a single CalendarEvent with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    CalendarEvent.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found CalendarEvent with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving CalendarEvent with id=" + id });
        });
};

// Update a CalendarEvent by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    CalendarEvent.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update CalendarEvent with id=${id}. Maybe CalendarEvent was not found!`
                });
            } else res.send({ message: "CalendarEvent was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating CalendarEvent with id=" + id
            });
        });
};

// Delete a CalendarEvent with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    CalendarEvent.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete CalendarEvent with id=${id}. Maybe CalendarEvent was not found!`,
                    status: false
                });
            } else {
                res.send({
                    message: "CalendarEvent was deleted successfully!",
                    status: true
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete CalendarEvent with id=" + id,
                status: false
            });
        });
};

// Delete all CalendarEvents from the database.
exports.deleteAll = (req, res) => {
    CalendarEvent.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} CalendarEvents were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tasks."
            });
        });
};

// Find all published CalendarEvents
exports.findAllPublished = (req, res) => {
    CalendarEvent.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks."
            });
        });
};