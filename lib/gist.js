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

    for (var f in json.files) {
      var file = json.files[f]

      try {
        var content = JSON.parse(file.content)
      } catch (e) {
        var msg = 'could not parse file contents of ' + file.filename + ': ' + e.message
        return callback(new Error(msg))
      }

      if (content.type && content.type === 'FeatureCollection') {
        content.name = file.filename
        content.updated_at = json.updated_at
        geojson.push(content)
      }
    }

    if (geojson.length) {
      return callback(null, geojson)
    }

    callback(new Error('could not find any geojson in gist ' + options.id))
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
