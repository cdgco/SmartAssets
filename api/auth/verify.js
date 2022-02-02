const db = require("../models");
const ROLES = db.roles;
const User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
        }

        if (user) {
            return res.json({
                "success": false,
                "code": 400,
                "errors": ["Failed! Username is already in use!"],
                "messages": ["Failed! Username is already in use!"],
                "result": null
            });
        }

        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (user) {
                return res.json({
                    "success": false,
                    "code": 400,
                    "errors": ["Failed! Email is already in use!"],
                    "messages": ["Failed! Email is already in use!"],
                    "result": null
                });
            }

            next();
        });
    });
};

checkRoleExists = (req, res, next) => {
    if (req.body.role) {
        ROLES.countDocuments({ name: req.body.role }, function(err, count) {
            if (count > 0) {
                next()
            } else {
                return res.json({
                    "success": false,
                    "code": 400,
                    "errors": [`Failed! Role ${req.body.role} does not exist!`],
                    "messages": [`Failed! Role ${req.body.role} does not exist!`],
                    "result": null
                });
            }
        });
    }
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRoleExists
};

module.exports = verifySignUp;