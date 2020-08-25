const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js") // CREATE THIS FILE
const db = require("../models")
const User = db.user
const Role = db.Role

verifyToken = (req, res, next) => {
    let token = req.headers["x-acces-token"]

    if (!toekn) {
        return res.status(403).send({ message: "No token provider" })
    }

    jwt.verify(token, config.secret, (err, decode) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized" })
        }
        req.userId = decode.userId
        next()
    })
}

isAdmin = () => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        Role.find({ _id: { $in: user.roles } }, (err, roles) => {
            if (err) {
                res.status(500).send({ message: err })
                return;
            }
            for (let i = 0; i < roles.length; i++) {
                if (roles[i] === "admin") {
                    next()
                    return;
                }
            }
            res.status(403).send({ message: "Require Admin ROLE!" })
            return;
        })
    })
}

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }

        Role.find({
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next()
                        return
                    }
                }
                res.status(403).send({ message: "Require Modaretor ROLE" })
                return
            }
        )
    })
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
}

module.exports = authJwt