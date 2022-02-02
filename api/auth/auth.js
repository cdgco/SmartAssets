const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const Role = db.roles;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    let secret = req.headers["x-access-signature"];

    if (!token) {
        res.json({
            "success": false,
            "code": 403,
            "errors": ["No token provided!"],
            "messages": ["No token provided!"],
            "result": null
        });
        return
    }


    // Prints: true
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.json({
                "success": false,
                "code": 401,
                "errors": ["Unauthorized"],
                "messages": ["Unauthorized"],
                "result": null
            });
            return
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
            return;
        }

        Role.find({
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.json({
                        "success": false,
                        "code": 500,
                        "errors": [err],
                        "messages": [err],
                        "result": null
                    });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                res.json({
                    "success": false,
                    "code": 403,
                    "errors": ["Require Admin Role!"],
                    "messages": ["Require Admin Role!"],
                    "result": null
                });
                return
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
};
module.exports = authJwt;