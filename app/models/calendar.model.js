module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        date: String
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const CalendarEvent = mongoose.model("calendar_events", schema);
    return CalendarEvent;
};