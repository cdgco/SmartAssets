const db = require("../models");
const Model = db.model;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Model.find()
        .exec((err, model) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!model) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No models found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": model

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Model.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete model with id=${id}. Maybe model was not found!`],
                    "messages": [`Cannot delete model with id=${id}. Maybe model was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Company was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete model with id=" + id],
                "messages": ["Could not delete model with id=" + id],
                "result": null
            });
        });
};