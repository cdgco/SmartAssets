var express = require('express');
const path = require('path');
var https = require('https');
var http = require('http');
var crypto = require('crypto');
var bcrypt = require("bcryptjs");
var fs = require('fs');
const history = require('connect-history-api-fallback')
var app = express();
require('dotenv').config()
const { Client } = require('@elastic/elasticsearch')
const elasticConfig = require("./elastic.config.js");
const dbConfig = require("./db.config.js");
const db = require("./api/models");
const User = db.users;
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

if (process.argv[2] != 'skipKeyCycle') {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'sect239k1'
    });
    const sign = crypto.createSign('SHA256');
    const token = crypto.randomUUID();
    sign.write(`${token}`);
    sign.end();
    var signature = sign.sign(privateKey, 'hex');
    process.env.JWT_SECRET = signature;
    fs.writeFile('jwt.key', signature, function(err) {
        if (err) return console.log(err);
    });
} else {
    fs.readFile("jwt.key", (err, signature) => {
        if (err) console.error(err);
        process.env.JWT_SECRET = signature.toString();
    });
}

app.use(express.text({ limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: false }));

User.countDocuments({})
    .then(data => {
        if (data == 0) {
            const userPass = crypto.randomUUID();
            const user = new User({
                username: "admin",
                password: bcrypt.hashSync(userPass, 8)
            });
            user.save();
            console.log("\nAdmin Username: admin\nAdmin Password: " + userPass)
        }
    })

elasticClient.indices.exists({ index: dbConfig.dbName }, (err, results) => {
    if (!results.body) {
        elasticClient.indices.create({ index: dbConfig.dbName })
    }
})
const apiRouter = require('./api');
app.use('/api', apiRouter);

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