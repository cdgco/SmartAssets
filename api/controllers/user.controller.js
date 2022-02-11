const db = require("../models");
const User = db.users;
const Role = db.roles;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require('fs');

exports.checkToken = (req, res) => {
    if (req.body.token && req.body.refresh) {
        jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err && err.name == "TokenExpiredError") { // If token is expired
                jwt.verify(req.body.refresh, process.env.JWT_SECRET, (refreshErr, decodedRefresh) => {
                    if (refreshErr) { // If refresh token is invalid
                        return res.json({
                            "success": false,
                            "code": 403,
                            "errors": [refreshErr],
                            "messages": ["Invalid Bearer Token"],
                            "result": null
                        });
                    } else if (Math.floor(new Date().getTime() / 1000.0) > decodedRefresh.sessionStart + 31556926) { // If max expiry passed
                        return res.json({
                            "success": false,
                            "code": 403,
                            "errors": ["Token Expired"],
                            "messages": ["Token Expired"],
                            "result": null
                        });
                    } else { // If refresh valid and within max expiry
                        var accessToken = jwt.sign({ id: decodedRefresh.id }, process.env.JWT_SECRET, {
                            expiresIn: 900
                        });

                        var expireTime = (decodedRefresh.rememberme) ? 2629743 : 86400

                        var refreshToken = jwt.sign({ id: decodedRefresh.id, rememberme: decodedRefresh.rememberme, sessionStart: decodedRefresh.sessionStart }, process.env.JWT_SECRET, {
                            expiresIn: expireTime
                        });
                        return res.json({
                            "success": true,
                            "code": 200,
                            "errors": [],
                            "messages": [],
                            "result": {
                                id: decodedRefresh.id,
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }
                        });
                    }
                })
            } else if (err) { // If token is invalid
                return res.json({
                    "success": false,
                    "code": 403,
                    "errors": [err],
                    "messages": ["Invalid Bearer Token"],
                    "result": null
                });
            } else {
                // If token is valid and was issued within 5 minutes, return same token
                if (Math.floor(new Date().getTime() / 1000.0) < decoded.iat + 300) {
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": [],
                        "result": {
                            id: decoded.id,
                            accessToken: req.body.token,
                            refreshToken: req.body.refresh
                        }
                    });
                } else { // If token and refresh token valid and issued 5+ min ago, extend token if within maxexpiry
                    jwt.verify(req.body.refresh, process.env.JWT_SECRET, (refreshErr, decodedRefresh) => {
                        if (refreshErr) { // If refresh token is invalid
                            return res.json({
                                "success": false,
                                "code": 403,
                                "errors": [refreshErr],
                                "messages": ["Invalid Bearer Token"],
                                "result": null
                            });
                        } else if (Math.floor(new Date().getTime() / 1000.0) > decodedRefresh.sessionStart + 31556926) { // If max expiry passed
                            return res.json({
                                "success": false,
                                "code": 403,
                                "errors": ["Token Expired"],
                                "messages": ["Token Expired"],
                                "result": null
                            });
                        } else { // If refresh valid and within max expiry
                            var accessToken = jwt.sign({ id: decodedRefresh.id }, process.env.JWT_SECRET, {
                                expiresIn: 900
                            });

                            var expireTime = (decodedRefresh.rememberme) ? 2629743 : 86400

                            var refreshToken = jwt.sign({ id: decodedRefresh.id, rememberme: decodedRefresh.rememberme, sessionStart: decodedRefresh.sessionStart }, process.env.JWT_SECRET, {
                                expiresIn: expireTime
                            });
                            return res.json({
                                "success": true,
                                "code": 200,
                                "errors": [],
                                "messages": [],
                                "result": {
                                    id: decodedRefresh.id,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken
                                }
                            });
                        }
                    })
                }
            }
        });
    }
};

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        name: req.body.name ? req.body.name : "",
        phone: req.body.phone ? req.body.phone : "",
        location: req.body.location ? req.body.location : "",
        title: req.body.title ? req.body.title : ""
    });

    user.save((err, user) => {
        if (err) {
            return res.json({
                "success": false,
                "code": 500,
                "errors": [err],
                "messages": [err],
                "result": null
            });
        }

        if (req.body.role) {
            Role.find({
                    name: { $in: req.body.role }
                },
                (err, roles) => {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            return res.json({
                                "success": false,
                                "code": 500,
                                "errors": [err],
                                "messages": [err],
                                "result": null
                            });
                        }
                        return res.json({
                            "success": true,
                            "code": 200,
                            "errors": [],
                            "messages": ["User was registered successfully!"],
                            "result": {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                name: user.name,
                                phone: user.phone,
                                location: user.location,
                                title: user.title
                            }
                        });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    return res.json({
                        "success": false,
                        "code": 500,
                        "errors": [err],
                        "messages": [err],
                        "result": null
                    });
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        return res.json({
                            "success": false,
                            "code": 500,
                            "errors": [err],
                            "messages": [err],
                            "result": null
                        });
                    }
                    return res.json({
                        "success": true,
                        "code": 200,
                        "errors": [],
                        "messages": ["User was registered successfully!"],
                        "result": {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            phone: user.phone,
                            location: user.location,
                            title: user.title
                        }
                    });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
            username: req.body.username
        })
        .populate("roles", "-__v")
        .exec((err, user) => {

            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!user) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["Invalid Credentials"],
                    "messages": [err],
                    "result": null
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.json({
                    "success": false,
                    "code": 401,
                    "errors": [],
                    "messages": ["Invalid Credentials"],
                    "result": null
                });
            }

            var accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900
            });

            var expireTime = (req.body.rememberme) ? 2629743 : 86400

            var refreshToken = jwt.sign({ id: user.id, rememberme: req.body.rememberme, sessionStart: Math.floor(new Date().getTime() / 1000.0) }, process.env.JWT_SECRET, {
                expiresIn: expireTime
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": {
                    id: user._id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            });
        });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    var dynCondition = {}
    var dynSort = {}
    if (req.query.username) {
        dynCondition.username = { $regex: new RegExp(username), $options: "i" }
    }
    if (req.query.email) {
        dynCondition.email = { $regex: new RegExp(email), $options: "i" }
    }
    if (req.query.phone) {
        dynCondition.phone = { $regex: new RegExp(phone), $options: "i" }
    }
    if (req.query.name) {
        dynCondition.name = { $regex: new RegExp(name), $options: "i" }
    }
    if (req.query.location) {
        dynCondition.location = { $regex: new RegExp(location), $options: "i" }
    }
    if (req.query.title) {
        dynCondition.title = { $regex: new RegExp(title), $options: "i" }
    }
    if (req.query.sort && req.query.sort.toLowerCase() == "asc") {
        dynSort._id = 1;
    } else if (req.query.sort && req.query.sort.toLowerCase() == "desc") {
        dynSort._id = -1;
    }

    User.find(dynCondition)
        .select("-password")
        .populate("roles", "name")
        .limit(parseInt(req.query.limit) || 0)
        .skip(parseInt(req.query.skip) || 0)
        .sort(dynSort)
        .exec((err, user) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!user) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No users found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": user

            });

        });

};

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select("-password")
        .populate("roles", "name")
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No found user with id " + id],
                    "messages": ["No found user with id " + id],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": [],
                    "result": data
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Error retrieving user with id=" + id],
                "messages": ["Error retrieving user with id=" + id],
                "result": null
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot update user with id=${id}. Maybe user was not found!`],
                    "messages": [`Cannot update user with id=${id}. Maybe user was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["User was updated successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Error updating user with id=" + id],
                "messages": ["Error updating user with id=" + id],
                "result": null
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete user with id=${id}. Maybe user was not found!`],
                    "messages": [`Cannot delete user with id=${id}. Maybe user was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["User was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete user with id=" + id],
                "messages": ["Could not delete user with id=" + id],
                "result": null
            });
        });
};