const { authJwt } = require("../../middlewares");
const user = require("./user.controller");
const router = require("express").Router();

module.exports = app => {
    // app.use(function(req, res, next) {
    //     res.header(
    //         "Access-Control-Allow-Headers",
    //         "x-access-token, Origin, Content-Type, Accept"
    //     );
    //     next();
    // });

    // app.get("/userAuth/all", user.allAccess);

    // app.get("/userAuth/user", [authJwt.verifyToken], user.userBoard);

    // app.get(
    //     "/user/mod", [authJwt.verifyToken, authJwt.isModerator],
    //     user.moderatorBoard
    // );

    // app.get(
    //     "userAuth/admin", [authJwt.verifyToken, authJwt.isAdmin],
    //     user.adminBoard
    // );
    router.get("/user/all/:project_id", user.getAll)
    router.post("/user/addUser", user.addUser)
    router.delete("/user/delete-from-project", user.deleteFromProject)
    app.use("/api", router);
};