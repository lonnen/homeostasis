var path = require('path');
var fs = require('fs');

/* Python new-style string formatting.
* > "Hello, {0}.".format('Mike');
* Hello, Mike.
* > "How is the weather in {citi}?".format({city: 'Mountain View'})
* How is the weather in Mountain View?
*/
String.prototype.format = function(obj) {
  var args = arguments;
  var str = this;
  // Support either an object, or a series.
  return str.replace(/\{[\w\d\._-]+\}/g, function(part) {
    // Strip off {}.
    part = part.slice(1, -1);
    var index = parseInt(part, 10);
    if (isNaN(index)) {
      return dottedGet(obj, part);
    } else {
      return args[index];
    }
  });
};
