module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        status: String,
        priority: String,
        type: String,
        workLog: Number,
        estimate: Number,
        date: String,
        comments: Array,
        global_taskID: String,
        author_User: Object,
        responsible_User: Object,
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Task = mongoose.model("task", schema);
    return Task;
};