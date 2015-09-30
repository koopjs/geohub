var async = require('async')
var request = require('./request')

/**
 * get geojson from a github repository file or directory
 *
 * @param  {object}   options - user, repo, path (optional), token (optional)
 * @param  {Function} callback - err, data
 */
function repo (options, callback) {
  var user = options.user
  var repo = options.repo
  var path = options.path
  var token = options.token

  if (!user || !repo) {
    return callback(new Error('must specify user, repo'))
  }

  if (path) {
    var contentsUrl = '/repos/' + user + '/' + repo + '/contents/'

    if (token) contentsUrl += '?access_token=' + token

    return request(contentsUrl, function (err, data) {
      if (err) {
        var msg = 'Error requesting data from ' + contentsUrl + ': ' + err.message
        return callback(new Error(msg))
      }

      var isDir = false

      data.forEach(function (f) {
        if (f.name === path && f.type === 'dir') isDir = true
      })

      if (isDir) {
        var url = '/repos/' + user + '/' + repo + '/contents/' + path

        if (token) url += '?access_token=' + token

        return request(url, function (err, json) {
          if (err) return callback(err)

          var files = []

          json.forEach(function (file) {
            if (file.name.match(/geojson/)) {
              files.push(file)
            }
          })

          if (files.length) {
            var filesUrl = 'https://raw.github.com/' + user + '/' + repo + '/master/' + path + '/'
            return repoFiles({
              url: filesUrl,
              files: files
            }, callback)
          }

          callback(new Error('could not find any geojson files at ' + url))
        })
      }

      var urls = [
        'https://api.github.com/repos/' + user + '/' + repo + '/contents/' + path + '.geojson',
        'https://raw.github.com/' + user + '/' + repo + '/master/' + path + '.geojson'
      ]

      if (token) urls[0] += '?access_token=' + token

      async.map(urls, function (url, cb) {
        request(url, cb)
      }, function (err, files) {
        if (err) return callback(err)

        var file = files[0]
        var json = files[1]
        var name = file.name
        var sha = file.sha
        var geojson = null

        if (json.type && json.type === 'FeatureCollection') {
          json.name = name
          json.sha = sha
          geojson = json
        }

        if (geojson) return callback(null, geojson)
        callback(new Error('could not find any geojson: ' + err.message))
      })
    })
  }

  var url = '/repos/' + user + '/' + repo + '/contents'

  if (token) url += '?access_token=' + token

  request(url, function (err, json) {
    if (err) return callback(err)

    var files = []

    json.forEach(function (file) {
      if (file.name.match(/geojson/)) {
        files.push(file)
      }
    })

    if (files.length) {
      var filesUrl = 'https://raw.github.com/' + user + '/' + repo + '/master/'
      return repoFiles({
        url: filesUrl,
        files: files
      }, callback)
    }

    callback(new Error('could not find any geojson files at ' + url))
  })
}

/**
 * get the SHA of a file in a github repository
 *
 * @param  {object}   options - user, repo, path (optional), token (optional)
 * @param  {Function} callback - err, sha
 */
function repoSha (options, callback) {
  var user = options.user
  var repo = options.repo
  var path = options.path
  var token = options.token

  if (!user || !repo || !path) {
    return callback(new Error('must specify user, repo, path'))
  }

  var url = '/repos/' + user + '/' + repo + '/contents/' + path
  if (token) url += '?access_token=' + token

  request(url, function (err, json) {
    if (err) return callback(err)
    if (json.message) return callback(new Error(json.message))
    if (json.sha) return callback(null, json.sha)
    callback(new Error('could not get sha for ' + url))
  })
}

/**
 * get geojson files from a specific raw.github.com repo directory URL
 *
 * @private
 * @param  {object}   options - url, files
 * @param  {Function} callback - err, data
 */
function repoFiles (options, callback) {
  var url = options.url
  var files = options.files

  if (!url || !files) {
    return callback(new Error('must specify url, files'))
  }

  var data = []

  async.forEachOf(files, function (item, key, callback) {
    request(url + item.name, function (err, json) {
      if (err) return callback(err)

      if (json && json.type && json.type === 'FeatureCollection') {
        json.name = item.name
        json.sha = item.sha
        data.push(json)

        return callback(null)
      }

      callback(new Error('problem accessing file ' + url + '/' + key))
    })
  }, function (err) {
    if (err) return callback(err)
    callback(null, data)
  })
}

module.exports = {
  repo: repo,
  repoSha: repoSha
}
