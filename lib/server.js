var http = require('http');

var express = require('express');

var config = require('./config');
var Homeostasis = require('./homeostasis.js').Homeostasis;
var utils = require('./utils');

var server;
var app = express();

var core = new Homeostasis(config);

app.use(express.compress());
app.use(express.json());

app.all('/', function(req, res){ res.send('pong');});
app.post('/checkClient', checkClient);


/* Respond to checkClient requests by forwarding the payload to the homeostasis
 * core where it will be processed by all enabled plugins. A JSON blob collating
 * the plugin results will be sent to the requestor, or an error will be logged
 * and an empty 500 returned.
 *
 * returns nothing
 */
function checkClient(req, res) {
    core.sendMessage(req.body)
        .then(
            function fulfilled(response) {
                res.send(JSON.stringify(response));
            },
            function rejected(err) {
                console.log(err);
                res.send(500);
            }
        );
}

/* Start the server listening on the configured port
 *
 * Examples
 *
 *   var server = require('./lib/server').start();
 *
 * returns a node http lib server object
 */
function start() {
    server = http.createServer(app);
    server.listen(
        config.PORT,
        function() {
            var address = server.address();
            console.log('Listening on {0}:{1}'.format(address.address, address.port));
        }
    );

    return server;
}

module.exports = {
    start: start,
    server: server,
};
