const db = require("../models");
const Supplier = db.supplier;
const Event = db.event;
var jwt = require("jsonwebtoken");

function logEvent(req, title, description, asset, assetId, type, color) {
    if (req.get('Authorization')) {
        jwt.verify(req.get('Authorization').replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                User.findById(decoded.id).then(data => {
                    var user = (data.email) ? data.email : '';
                    const event = new Event({
                        title: title,
                        description: description,
                        user: user,
                        userId: decoded.id,
                        asset: asset,
                        asserId: assetId,
                        type: type,
                        color: color
                    });

                    event.save((error, event) => { return event });
                })
            } else {
                const event = new Event({
                    title: title,
                    description: description,
                    user: null,
                    userId: null,
                    asset: asset,
                    assetId: assetId,
                    type: type,
                    color: color
                });

                event.save((error, event) => { return event });
            }
        })
    } else {
        const event = new Event({
            title: title,
            description: description,
            user: null,
            userID: null,
            asset: asset,
            assetId: assetId,
            type: type,
            color: color
        });

        event.save((error, event) => { return event });
    }
}

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
                logEvent(req, "Supplier Deleted: " + data.name, "Suppleir Deleted", null, null, "user", "red")
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