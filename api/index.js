var express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const apiRouter = require('express').Router();

const apiSpec = path.join(__dirname, 'api.yaml');

apiRouter.use('/api/spec', express.static(apiSpec));

apiRouter.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
    }),
);

apiRouter.get('/api/', function(req, res, next) {
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [
            "hooray! welcome to our api!"
        ],
        "result": null
    });
});

apiRouter.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        "success": false,
        "code": (err.status || 500),
        "messages": [err.message],
        "errors": err.errors,
        "result": null
    });
});


module.exports = apiRouter;