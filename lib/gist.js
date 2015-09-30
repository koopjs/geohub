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

  var url = '/gists/' + options.id

  if (options.token) url += '?access_token=' + options.token

  request(url, function (err, json) {
    if (err) return callback(err)

    var geojson = []

    /**
     * find and parse geojson objects in a given github gist api "files" object
     *
     * @private
     * @param  {object}   item - github gist file object
     * @param  {object}   key - github gist file key
     * @param  {Function} callback - err, result
     */
    function processGithubFile (item, key, callback) {
      /**
       * returns geojson if found
       *
       * @private
       * @param  {object}   json - json that might be geojson
       * @param  {Function} callback - err, geojson || undefined
       */
      function findGeoJson (content, callback) {
        if (content.type && content.type === 'FeatureCollection') {
          content.name = key
          content.updated_at = json.updated_at
          geojson.push(content)
        }

        callback(null)
      }

      if (item.truncated) {
        return request(item.raw_url, function (err, content) {
          if (err) return callback(err)
          findGeoJson(content, callback)
        })
      }

      try {
        var content = JSON.parse(item.content)
      } catch (e) {
        var msg = 'could not parse file contents of ' + key + ': ' + e.message
        return callback(new Error(msg))
      }

      findGeoJson(content, callback)
    }

    async.forEachOf(json.files, processGithubFile, function (err) {
      if (err) return callback(err)
      if (!geojson.length) return callback(new Error('no geojson found in gist ' + options.id))

      callback(null, geojson)
    })
  })
}

/**
 * get the SHA (NOPE: it's just updated_at) of a gist by ID
 * @param  {string}   id - gist ID
 * @param  {string}   token - access token (optional)
 * @param  {Function} callback - err, updated_at?
 */
function gistSha (id, token, callback) {
  var url = '/gists/' + id
  if (token) url += '?access_token=' + token

  request(url, function (err, json) {
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
