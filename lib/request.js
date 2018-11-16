const request = require('request')
const debug = require('debug')('geohub:request')
const pkg = require('../package.json')
const apiBase = 'https://api.github.com'

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
    let json
    try {
      json = JSON.parse(body)
    } catch (e) {
      return callback(new Error(`Failed to parse JSON from ${options.url} (status code: ${res.statusCode}, body: ${body})`))
    }

    if (json.message) {
      return callback(new Error(res.statusCode + ' (github): ' + json.message))
    }

    callback(null, json)
  })
}

module.exports = geohubRequest
