const db = require("../models");
const Supplier = db.supplier;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

    Supplier.find()
        .exec((err, supplier) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!supplier) {
                return res.json({
                    "success": false,
                    "code": 404,
                    "errors": ["No suppliers found"],
                    "messages": [err],
                    "result": null
                });
            }

            return res.json({
                "success": true,
                "code": 200,
                "errors": [],
                "messages": [],
                "result": supplier

            });

        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Supplier.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.json({
                    "success": false,
                    "code": 404,
                    "errors": [`Cannot delete supplier with id=${id}. Maybe supplier was not found!`],
                    "messages": [`Cannot delete supplier with id=${id}. Maybe supplier was not found!`],
                    "result": null
                });
            } else {
                res.json({
                    "success": true,
                    "code": 200,
                    "errors": [],
                    "messages": ["Supplier was deleted successfully!"],
                    "result": null
                });
            }
        })
        .catch(err => {
            res.json({
                "success": false,
                "code": 500,
                "errors": ["Could not delete supplier with id=" + id],
                "messages": ["Could not delete supplier with id=" + id],
                "result": null
            });
        });
};