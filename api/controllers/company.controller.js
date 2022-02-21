const db = require("../models");
const Company = db.company;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Company.find()
        .exec((err, company) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!company) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No companies found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": company

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Company.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete company with id=${id}. Maybe company was not found!`],
                    "messages": [`Cannot delete company with id=${id}. Maybe company was not found!`],
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
                "errors": ["Could not delete company with id=" + id],
                "messages": ["Could not delete company with id=" + id],
                "result": null
            });
        });
};