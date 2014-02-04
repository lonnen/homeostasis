/* Detects if the default search engine has changed
 *
 * responds an object containing the severity and potential user actions
 */
module.exports = function(core) {
  core.onMessage(function(content) {
    switch (content.version) {
        //case 3:
        //    return versionTree(content);
        case 2:
            return versionTwo(content);
        default:
            console.log(
                'no searchEngineChange function for payload version ' +
                content.version
            );
            return {
              'result': 0,
              'warnings': {},
              'highlights': {}
            };
    }
  });
};


/* search engine change detector for the FHR payload version three
 *
 * returns an object containing the severity and potential user actions
 */
function versionTwo(content) {
    var days = content.data.days;

    var dates = [];
    for (var i in days) {
        dates.push(i);
    }
    dates.sort();

    var searches = dates.map(function(date) {
        var day = days[date]['org.mozilla.searches.counts'] || {};
        day.date = date;
        return day;
    });
    console.log(searches);



    return {
      'result': 0,
      'warnings': {},
      'highlights': {}
    };
}
