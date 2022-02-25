const db = require("../models");
const Tags = db.tags;
const Event = db.event;
var jwt = require("jsonwebtoken");

function logEvent(req, title, description, asset, type, color) {
    if (req.get('Authorization')) {
        jwt.verify(req.get('Authorization').replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                User.findById(decoded.id).then(data => {
                    var user = (data.email) ? data.email : '';
                    const event = new Event({
                        title: title,
                        description: description,
                        user: user,
                        asset: asset,
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
                    asset: asset,
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
            asset: asset,
            type: type,
            color: color
        });

        event.save((error, event) => { return event });
    }
}

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
                logEvent(req, "Tag Deleted", "Tag Deleted", null, "user", "red")
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