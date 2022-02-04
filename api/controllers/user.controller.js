const crypto = require('crypto');
const db = require("../models");
const User = db.users;
const Role = db.roles;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

            const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: 'sect239k1'
            });

            // generate a signature of the payload
            const sign = crypto.createSign('SHA256');
            sign.write(`${user}`);
            sign.end();
            var signature = sign.sign(privateKey, 'hex');
            console.log(signature)


            // sign username
            var token = jwt.sign({ id: user.id }, signature, {
                expiresIn: 86400 // 24 hours
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
                    accessToken: token, // access token
                    signature: signature // signature
                }
            });
        });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    const phone = req.query.phone;
    const name = req.query.name;
    if (username) {
        var condition = { username: { $regex: new RegExp(username), $options: "i" } };
    } else if (email) {
        var condition = { email: { $regex: new RegExp(email), $options: "i" } };
    } else if (phone) {
        var condition = { phone: { $regex: new RegExp(phone), $options: "i" } };
    } else if (name) {
        var condition = { name: { $regex: new RegExp(name), $options: "i" } };
    } else {
        var condition = {};
    }
    User.find(condition)
        .select("-password")
        .populate("roles", "name")
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