const db = require("../models");
const Location = db.location;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Location.find()
        .exec((err, location) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!location) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No locations found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": location

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Location.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete location with id=${id}. Maybe location was not found!`],
                    "messages": [`Cannot delete location with id=${id}. Maybe location was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Location was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete location with id=" + id],
                "messages": ["Could not delete location with id=" + id],
                "result": null
            });
        });
};