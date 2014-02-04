/* logs the message. useful for debugging. returns the expected object format
 * even though this produces no material info for end users.
 *
 */

module.exports = function(core) {
  core.onMessage(function(content) {
    console.log(content);
    return {
      'result': 0,
      'warnings': {},
      'highlights': {}
    };
  });
};
