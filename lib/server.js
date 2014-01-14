var http = require('http');

var express = require('express');

var config = require('./config');
var Homeostasis = require('./homeostasis.js').Homeostasis;
var utils = require('./utils');

var server ;
var app = express();

var core = new Homeostasis(config);

app.use(express.compress());
app.use(express.json());


app.post('/checkClient', function checkClient(req, res) {
  console.log(req);
  core.sendMessage('msg', req.body)
    .then(function(result) {
      res.send(JSON.stringify(result));
    });
});

app.all('/', function(req, res){ res.send('pong')})


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
