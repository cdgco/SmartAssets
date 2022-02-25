var express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const apiRouter = require('express').Router();
var rateLimit = require('express-rate-limit');
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { auth_jwt_token } = require("./auth");
var jwt = require("jsonwebtoken");

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

apiRouter.use('/spec', express.static(apiSpec));

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
                },
                BearerAuth: (req, scopes, schema) => {
                    var parts = req.get('Authorization').split(' ');
                    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
                        try {
                            jwt.verify(parts[1], process.env.JWT_SECRET)
                            return true
                        } catch (ex) { return false }
                    } else return false

                }
            }
        }
    }), );

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

apiRouter.use('/users', userRouter, function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

const assetRouter = require('./routes/asset.router.js');
apiRouter.use('/assets', assetRouter);

const companyRouter = require('./routes/company.router.js');
apiRouter.use('/company', companyRouter);

const locationRouter = require('./routes/location.router.js');
apiRouter.use('/location', locationRouter);

const manufacturerRouter = require('./routes/manufacturer.router.js');
apiRouter.use('/manufacturer', manufacturerRouter);

const modelRouter = require('./routes/model.router.js');
apiRouter.use('/model', modelRouter);

const supplierRouter = require('./routes/supplier.router.js');
apiRouter.use('/supplier', supplierRouter);

const tagsRouter = require('./routes/tags.router.js');
apiRouter.use('/tags', tagsRouter);

const typeRouter = require('./routes/type.router.js');
apiRouter.use('/type', typeRouter);

const eventRouter = require('./routes/event.router.js');
apiRouter.use('/event', eventRouter);

apiRouter.get('/', function(req, res, next) {
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