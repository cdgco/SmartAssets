const db = require("../models");
const Tags = db.tags;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Tags.find()
        .exec((err, tags) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!tags) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No tags found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": tags

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Tags.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete tag with id=${id}. Maybe tag was not found!`],
                    "messages": [`Cannot delete tag with id=${id}. Maybe tag was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Tag was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete tag with id=" + id],
                "messages": ["Could not delete tag with id=" + id],
                "result": null
            });
        });
};