var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const history = require('connect-history-api-fallback')

// put server express routes at the beginning //
var app = express();

var router = express.Router();

// GET /api/users
router.get('/users', (req, res) => {
    res.send('GET request to users')
})

// GET /api/users/:id
router.get('/users/:id', (req, res) => {
    res.send('GET request to users/:id')
})

router.get('/', function(req, res) {
    res.send('GET request to the homepage')
})

// POST method route
router.post('/', function(req, res) {
    res.send('POST request to the homepage')
})
router.get('*', (req, res) => {
    res.send('API ERROR')
});

app.use('/api', router);
// put server express routes at the beginning //
app.use(history())
    //Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/dist')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8082

app.listen(port, () => {
    console.log("Server running on port " + port);
});
