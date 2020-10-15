const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/userAuth/all", controller.allAccess);

    app.get("/api/userAuth/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/userAuth/mod", [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/userAuth/admin", [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};