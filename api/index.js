var express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const apiRouter = require('express').Router();
var rateLimit = require('express-rate-limit')

const allowlist = ['127.0.0.1']

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        "success": false,
        "code": 429,
        "errors": [{
            "message": "too many requests. please try again later"
        }],
        "messages": ["too many requests. please try again later"],
        "result": null
    },
    skip: (request, response) => allowlist.includes(request.ip),
})

apiRouter.use(limiter)

const apiKeys = new Map();
apiKeys.set('24023tuf098252cn409v4850n2', {
    id: 1,
    name: 'user1',
    secret: 'secret1'
});
apiKeys.set('987654321', {
    id: 2,
    name: 'user2',
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
    var curApiKey = req.get('X-API-KEY');
    res.json({
        "success": true,
        "code": 200,
        "errors": [],
        "messages": [
            "hooray! welcome to our api!",
            "api key: " + curApiKey,
            "user id: " + apiKeys.get(curApiKey)['id'],
            "name: " + apiKeys.get(curApiKey)['name'],
            "secret: " + apiKeys.get(curApiKey)['secret'],
        ],
        "result": null
    });
});

apiRouter.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        "success": false,
        "code": (err.status || 500),
        "errors": err.errors,
        "messages": [err.message],
        "result": null
    });
});


module.exports = apiRouter;