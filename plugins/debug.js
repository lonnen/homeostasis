/* Description:
* logs the message
*
* Dependencies:
* None
*
* Author:
* lonnen
*/

module.exports = function(core) {
  core.on('msg', function(content, promise) {
    console.log(content);
    promise.fulfill(content);
  });
};
