var express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const apiRouter = require('express').Router();
var rateLimit = require('express-rate-limit');
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { auth_jwt_token } = require("./auth");

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

//apiRouter.use(limiter)
apiRouter.use(morgan("dev"));

apiRouter.use(cors());

apiRouter.use(bodyParser.urlencoded({ extended: false }));
apiRouter.use(bodyParser.json());

const apiKeys = new Map();
apiKeys.set('b57a83f9-9e39-4bc3-94cd-a3ca1388dea0', {
    id: 1,
    name: 'global',
    secret: 'secret1'
});
apiKeys.set('8c626f83-b5ca-4891-9e77-af95244a76ef', {
    id: 2,
    name: 'assets',
    secret: 'secret2'
});
apiKeys.set('4d4657e9-6f4c-4262-b18a-16b4ef89f565', {
    id: 3,
    name: 'projects',
    secret: 'secret3'
});
apiKeys.set('790168d5-bc87-404a-aded-6664887c1d8d', {
    id: 4,
    name: 'users',
    secret: 'secret4'
});

const apiSpec = path.join(__dirname, 'api.yaml');

apiRouter.use('/api/spec', express.static(apiSpec));

apiRouter.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true, // true
        validateResponses: true, // true
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

const db = require("./models/");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

const Role = db.roles
Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
        new Role({ name: "user" }).save();
        new Role({ name: "admin" }).save();
    }
});

const userRouter = require('./routes/user.router.js') // user authentication

apiRouter.use('/api/users', userRouter, function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

const assetRouter = require('./routes/asset.router.js');
apiRouter.use('/api/assets', assetRouter);

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
        "errors": err.errors,
        "messages": [err.message],
        "result": null
    });
});


module.exports = apiRouter;