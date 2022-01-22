var express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback')
var app = express();

const apiRouter = require('./api');
app.use('/', apiRouter);

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use(history())
app.use(express.static(path.join(__dirname, '/dist')));

var port = process.env.port || 8082

app.listen(port, () => {
    console.log("Server running on port " + port);
});