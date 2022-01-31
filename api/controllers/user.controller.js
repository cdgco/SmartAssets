const db = require("../models");
const User = db.users;

// Create and Save a new asset
exports.create = (req, res) => {
    // Create a Tutorial
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin ? req.body.admin : false,
        name: req.body.name ? req.body.name : "",
        phone: req.body.phone ? req.body.phone : "",
        location: req.body.location ? req.body.location : "",
        title: req.body.title ? req.body.title : ""
    });

    user.save(user)
        .then(data => {
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": data
            });
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while creating the user."],
                "messages": [err.message || "Some error occurred while creating the user."],
                "result": null
            });
        });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    if (email) {
        var condition = { email: { $regex: new RegExp(username), $options: "i" } };
    } else {
        if (username) {
            var condition = { username: { $regex: new RegExp(username), $options: "i" } };
        } else {
            var condition = {};
        }
    }

    User.find(condition)
        .then(data => {
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": data
            });
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while retrieving users."],
                "messages": [err.message || "Some error occurred while retrieving users."],
                "result": null
            });
        });
};

// find all published assets
exports.findAllAdmin = (req, res) => {
    User.find({ admin: true })
        .then(data => {
            res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": data
            });
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": [err.message || "Some error occurred while retrieving users."],
                "messages": [err.message || "Some error occurred while retrieving users."],
                "result": null
            });
        });
};

// Find a single asset with a id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findById(id)
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

// Update a asset identified by the id in the request
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

// Delete an asset with the specified id in the request
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