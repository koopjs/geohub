var request = require('request')
var pkg = require('../package.json')
var apiBase = 'https://api.github.com'

/**
 * handles requests by geohub to the github API
 *
 * @param  {string}   url
 * @param  {Function} callback
 */
function geohubRequest (url, callback) {
  if (url.indexOf('https://') !== 0) {
    url = apiBase + url
  }

  var options = {
    url: url,
    headers: {
      'User-Agent': 'geohub/' + pkg.version
    }
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)

    try {
      var json = JSON.parse(body)
    } catch (e) {
      var msg = 'Failed to parse JSON from ' + url
      msg += ' (status code: ' + res.statusCode + ', body: ' + body + ')'
      callback(new Error(msg))
    }

    if (json.message) {
      return callback(new Error(res.statusCode + ' (github): ' + json.message))
    }

    callback(null, json)
  })
}

module.exports = geohubRequest
