/* Default app configuration
 *
 * when the module is loaded, it will also pull in all environment variables
 * as configuration.
 */

var config = {
    PORT: 8080,
    //plugins: ['debug', 'searchEngineChange']
    plugins: ['searchEngineChange']
};

for (var key in process.env) {
    config[key] = process.env[key];
}

module.exports = config;
