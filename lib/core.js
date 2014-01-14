var path = require('path');

var promise = require('promisesaplus');

var utils = require('./utils');
var config = require('./config');
var server = require('./server');


function Homeostasis() {
  this.dirname = path.normalize(__dirname + '/../');
  this.config = config;
  this.utils = utils;

  this.listeners = {};

  this.start = function() {
    this.server = server.start(this);
  };

  this.loadPlugins();
}

Homeostasis.prototype.sendMessage = function(name, message) {
  var listeners = this.listeners[name] || [];
  var i = 0;
  var top_p = promise();

  function next(msg) {
    if (i >= listeners.length) {
      top_p.fulfill(msg);
      return;
    }
    var p = promise();
    listeners[i](msg, p);
    i++;
    p.then(
      function fulfilled(msg) {
        next(msg);
      },
      function rejected(err) {
        console.log(err);
        top_p.reject(msg);
      }
    );
  }

  next(message);

  top_p.then(null, function(err) {
    console.log(err);
  });

  return top_p;
};

Homeostasis.prototype.on = function(name, cb) {
  this.listeners[name] = this.listeners[name] || [];
  this.listeners[name].push(cb);
};

Homeostasis.prototype.loadPlugins = function() {
  function checkError(name, e) {
    if (e.code && e.code === 'MODULE_NOT_FOUND') {
      return true;
    } else {
      console.error('Error loading module "{0}": {1}.'.format(name, e));
      return false;
    }
  }

  // For every listed plugin,
  this.config.plugins.forEach(function(name, i) {
    try {
      require('../plugins/' + name)(this);
      console.log('Loaded local plugin "{0}".'.format(name));
    } catch(e) {
      if (checkError(e, name)) {
        try {
          require(name)(this);
          console.log('Loaded npm plugin "{0}".'.format(name));
        } catch(e) {
          if (checkError(e, name)) {
            console.error('Could not load plugin "{0}".'.format(name));
          }
        }
      }
    }
  }.bind(this));
};

module.exports = {
  start: function() {
    var core = new Homeostasis();
    core.start();
    return core;
  }
};
