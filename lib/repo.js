var async = require('async')
var request = require('./request')

/**
 * get geojson from a github repository file or directory
 *
 * @param  {string}   user - github username
 * @param  {string}   repo - github repository
 * @param  {string}   path - path to file/dir (optional)
 * @param  {string}   token - access token (optional)
 * @param  {Function} callback - err, data
 */
function repo (user, repo, path, token, callback) {
  if (!user || !repo) {
    return callback(new Error('must specify at least user and repo'))
  }

  if (path) {
    // check the contents (checks for dirs as the path)
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
            return repoFiles(filesUrl, files, callback)
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

  // scan the repo contents
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
      return repoFiles(filesUrl, files, callback)
    }

    callback(new Error('could not find any geojson files at ' + url))
  })
}

/**
 * get the SHA of a file in a github repository
 *
 * @param  {string}   user - github username
 * @param  {string}   repo - github repository
 * @param  {string}   path - path to file
 * @param  {string}   token - access token (optional)
 * @param  {Function} callback - err, sha
 */
function repoSha (user, repo, path, token, callback) {
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
 * get geojson files from a specific directory URL in a github repository
 *
 * @private
 * @param  {string}   url - github url
 * @param  {array}    files - array of file objects
 * @param  {Function} callback - err, data
 */
function repoFiles (url, files, callback) {
  var data = []
  var errorCatch = false

  function done (fname) {
    if (data.length === files.length) {
      callback(null, data)
    } else if (errorCatch) {
      callback(new Error('problem accessing file ' + url + '/' + fname))
    }
  }

  files.forEach(function (f) {
    request(url + f.name, function (err, json) {
      if (err) return callback(err)

      if (json && json.type && json.type === 'FeatureCollection') {
        json.name = f.name
        json.sha = f.sha
        data.push(json)
      } else {
        errorCatch = true
      }

      done(f.name)
    })
  })
}

module.exports = {
  repo: repo,
  repoSha: repoSha
}
