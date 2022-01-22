var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const history = require('connect-history-api-fallback')
const OpenApiValidator = require('express-openapi-validator');

var app = express();

const apiSpec = path.join(__dirname, 'api.yaml');

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use('/api/spec', express.static(apiSpec));

app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
    }),
);

app.get('/api/', function(req, res, next) {
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

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        "success": false,
        "code": (err.status || 500),
        "messages": [err.message],
        "errors": err.errors,
        "result": null
    });
});

app.use(history())
app.use(express.static(path.join(__dirname, '/dist')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8082

app.listen(port, () => {
    console.log("Server running on port " + port);
});