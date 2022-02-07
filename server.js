var express = require('express');
const path = require('path');
var https = require('https');
var http = require('http');
const history = require('connect-history-api-fallback')
var app = express();
require('dotenv').config()
const { Client } = require('@elastic/elasticsearch')
const elasticConfig = require("./elastic.config.js");
const dbConfig = require("./db.config.js");
const elasticClient = new Client({
    node: elasticConfig.protocol + "://" + elasticConfig.host + ":" + elasticConfig.port,
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
})

var selfsigned = require('selfsigned');
var attrs = [{ name: 'commonName', value: 'localhost' }];
var pems = selfsigned.generate(attrs, { days: 365 });

var options = {
    key: pems['private'],
    cert: pems['cert']
};

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

elasticClient.indices.exists({ index: dbConfig.dbName }, (err, results) => {
    if (!results.body) {
        elasticClient.indices.create({ index: dbConfig.dbName })
    }
})
const apiRouter = require('./api');
app.use('/', apiRouter);

app.use(history())
app.use(express.static(path.join(__dirname, '/dist')));

var httpPort = process.env.httpPort || 8080
var httpsPort = process.env.httpsPort || 8443

http.createServer(app).listen(httpPort, () => {
    console.log("HTTP Server running on port " + httpPort);
});
https.createServer(options, app).listen(httpsPort, () => {
    console.log("HTTPS Server running on port " + httpsPort);
});