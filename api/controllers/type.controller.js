const db = require("../models");
const Type = db.type;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Type.find()
        .exec((err, type) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!type) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No types found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": type

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Type.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete type with id=${id}. Maybe type was not found!`],
                    "messages": [`Cannot delete type with id=${id}. Maybe type was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Type was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete type with id=" + id],
                "messages": ["Could not delete type with id=" + id],
                "result": null
            });
        });
};