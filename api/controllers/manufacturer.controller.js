const db = require("../models");
const Manufacturer = db.manufacturer;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Manufacturer.find()
        .exec((err, manufacturer) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!manufacturer) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No manufacturers found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": manufacturer

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Manufacturer.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete manufacturer with id=${id}. Maybe manufacturer was not found!`],
                    "messages": [`Cannot delete manufacturer with id=${id}. Maybe manufacturer was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Manufacturer was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete manufacturer with id=" + id],
                "messages": ["Could not delete manufacturer with id=" + id],
                "result": null
            });
        });
};