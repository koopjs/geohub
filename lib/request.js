var request = require('request')
var debug = require('debug')('geohub:request')
var pkg = require('../package.json')
var apiBase = 'https://api.github.com'

/**
 * handles requests by geohub to the github API
 *
 * @param  {object}   options - url (string), qs (object)
 * @param  {Function} callback
 */
function geohubRequest (options, callback) {
  if (options.url.indexOf('https://') !== 0) {
    options.url = apiBase + options.url
  }

  options.headers = {
    'User-Agent': 'geohub/' + pkg.version
  }

  // delete null/undefined access token to avoid 401 from github
  if (options.qs && !options.qs.access_token) {
    delete options.qs.access_token
  }

  debug(options)

  request(options, function (err, res, body) {
    if (err) return callback(err)

    try {
      var json = JSON.parse(body)
    } catch (e) {
      var msg = 'Failed to parse JSON from ' + options.url
      msg += ' (status code: ' + res.statusCode + ', body: ' + body + ')'
      return callback(new Error(msg))
    }

    if (json.message) {
      return callback(new Error(res.statusCode + ' (github): ' + json.message))
    }

    callback(null, json)
  })
}

module.exports = geohubRequest
