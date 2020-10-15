module.exports = mongoose => {
    var schema = mongoose.Schema({
        userID: String,
        projectID: String
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ProjectUser = mongoose.model("project_user", schema);
    return ProjectUser;
};