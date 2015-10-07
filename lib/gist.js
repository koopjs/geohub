var async = require('async')
var request = require('./request')

/**
 * get geojson from a gist
 *
 * @param  {object}   options - id, token (optional)
 * @param  {Function} callback - err, data
 */
function gist (options, callback) {
  if (!options.id) return callback(new Error('missing option: id'))

  request({
    url: '/gists/' + options.id,
    qs: {
      access_token: options.token
    }
  }, function (err, json) {
    if (err) return callback(err)

    var results = []

    async.forEachOf(json.files, function (item, key, callback) {
      processGithubFile({
        item: item,
        key: key,
        json: json
      }, function (err, geojson) {
        if (err) return callback(err)
        if (geojson) results.push(geojson)
        callback(null)
      })
    }, function (err) {
      if (err) return callback(err)
      if (!results.length) return callback(new Error('no geojson found in gist ' + options.id))
      callback(null, results)
    })
  })
}

/**
 * find and parse geojson objects in a given github gist api "files" object
 *
 * @private
 * @param  {object}   options - item, key, json
 * @param  {Function} callback - err, geojson
 */
function processGithubFile (options, callback) {
  var item = options.item
  var key = options.key
  var json = options.json

  function respond (content) {
    if (isFeatureCollection(content)) {
      content.name = key
      content.updated_at = json.updated_at
      return content
    }
    return false
  }

  if (item.truncated) {
    return request({
      url: item.raw_url
    }, function (err, content) {
      if (err) return callback(err)

      callback(null, respond(content))
    })
  }

  try {
    var content = JSON.parse(item.content)
  } catch (e) {
    var msg = 'could not parse file contents of ' + key + ': ' + e.message
    return callback(new Error(msg))
  }

  callback(null, respond(content))
}

/**
 * returns geojson if found
 *
 * @private
 * @param {object} options - content, json, key
 */
function isFeatureCollection (obj) {
  if (obj.type && obj.type === 'FeatureCollection') return true
  return false
}

/**
 * get the SHA (NOPE: it's just updated_at) of a gist by ID
 *
 * @param  {object}   options - id, token (optional)
 * @param  {Function} callback - err, updated_at?
 */
function gistSha (options, callback) {
  if (!options.id) return callback(new Error('missing option: id'))

  var url = '/gists/' + options.id

  request({
    url: url,
    qs: {
      access_token: options.token
    }
  }, function (err, json) {
    if (err) return callback(err)
    if (json.message) return callback(new Error(json.message))
    if (json.updated_at) return callback(null, json.updated_at)
    callback(new Error('could not get sha for ' + url))
  })
}

module.exports = {
  gist: gist,
  gistSha: gistSha
}
