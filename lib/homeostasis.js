var Promise = require('es6-promise').Promise;

/* The plugin manager
 *
 * config -- application config, used to determine what plugins to enable
 *
 * Examples
 *
 *   var core = new Homeostasis();
 */
function Homeostasis(config) {
    this.config = config;
    this.listeners = [];

    /* Load a plugin
     *
     * path - the path to the file
     *
     * Examples
     *
     *   loadPlugin('../plugins/debug.js');
     *
     * returns a boolean indicating success or failure
     */
    var loadPlugin = (function(path) {
        try {
            require(path)(this);
            console.log('Loaded plugin "{0}".'.format(path));
            return true;
        } catch (e) {
            console.error('Unable to load module "{0}", {1}'.format(path, e));
        }
        return false;
    }).bind(this);

    // For every listed plugin,
    this.config.plugins.forEach(function(name) {
        return loadPlugin('../plugins/' + name + '.js') || loadPlugin(name);
    });
}

/* Send a message through all the message handlers
 *
 * message - an arbitrary message for the plugins to handle
 *
 * Examples
 *
 *   core.sendMessage("this can be any object, not necessarily a string");
 *   core.sendMessage({type: "error", message: "Because the Internet."});
 *
 * returns a promise wrapping all applicable message handlers
 */
Homeostasis.prototype.sendMessage = function(message) {
    var promises = this.listeners.map(function(listener) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(listener(message));
            } catch (e) {
                reject(e);
            }
        });
    });

    return Promise.all(promises)
        .then(function(result) {
            return result.reduce(function(prev, curr) {
                var warnings = curr.warnings;
                var highlights = curr.highlights;
                var key;

                prev.result = Math.max(prev.result, curr.result);

                for (key in warnings) {
                    prev.warnings[key] = warnings[key];
                }

                for (key in highlights) {
                    prev.highlights[key] = highlights[key];
                }


                return prev;
            });
        });
};

/* Register a new message handling function
 *
 * handler - a function to call when a message is recieved
 *
 * Examples
 *
 *   core.onMessage(function(msg) { console.log(msg); });
 */
Homeostasis.prototype.onMessage = function(handler) {
    this.listeners.push(handler);
};

module.exports = {
    Homeostasis: Homeostasis
};
