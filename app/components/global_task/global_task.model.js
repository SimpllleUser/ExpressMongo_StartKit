module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        projectID: String
    }, { timestamps: true });


    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const GlobalTask = mongoose.model("global_task", schema);
    return GlobalTask;
};