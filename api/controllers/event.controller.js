const db = require("../models");
const Event = db.event;

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    var dynSort = {}
    if (req.query.sort && req.query.sort.toLowerCase() == "asc") {
        dynSort._id = 1;
    } else dynSort._id = -1;
    var dynCondition = {}
    if (req.query.type && req.query.type != "all") {
        dynCondition.type = req.query.type
    }
    if (req.query.user) {
        dynCondition.userId = req.query.user
    }
    if (req.query.asset) {
        dynCondition.assetId = req.query.asset
    }
    Event.find(dynCondition)
        .skip(parseInt(req.query.skip) || 0)
        .limit(parseInt(req.query.limit) || 0)
        .sort(dynSort)
        .exec((err, events) => {
            if (err) {
                return res.json({
                    "success": false,
                    "code": 500,
                    "errors": [err],
                    "messages": [err],
                    "result": null
                });
            }

            if (!events) {
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
                "result": events

            });

        });

};