var express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const apiRouter = require('express').Router();

const apiKeys = new Map();
apiKeys.set('24023tuf098252cn409v4850n2', {
    id: 1,
    name: 'app1',
    secret: 'secret1'
});
apiKeys.set('987654321', {
    id: 2,
    name: 'app2',
    secret: 'secret2'
});

const apiSpec = path.join(__dirname, 'api.yaml');

apiRouter.use('/api/spec', express.static(apiSpec));

apiRouter.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
        validateSecurity: {
            handlers: {
                ApiKeyAuth: (req, scopes, schema) => {
                    if (apiKeys.has(req.get('X-API-KEY'))) {
                        return true;
                    }
                }
            }
        }
    }),
);

apiRouter.get('/api/', function(req, res, next) {
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [
            "hooray! welcome to our api!",
            "api key: " + req.get('X-API-KEY'),
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