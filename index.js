var request = require('request')
var async = require('async')

module.exports = {
  apiBase: 'https://api.github.com/',

  request: function (url, callback) {
    if (url.indexOf('https://') !== 0) {
      url = this.apiBase + url
    }

    var options = {
      url: url,
      headers: {
        'User-Agent': 'geohub'
      }
    }

    request(options, function (err, response, body) {
      if (err) return callback(err)

      if (response.statusCode === '403') return callback(new Error('[github] 403: Forbidden'))
      if (response.statusCode === '404') return callback(new Error('[github] 404: Not Found'))
      if (response.statusCode === '500') return callback(new Error('[github] 500: Internal Server Error'))

      try {
        var json = JSON.parse(body)
        callback(null, json)
      } catch (e) {
        var msg = 'Failed to parse JSON from ' + url
        msg += ' (status code: ' + response.statusCode + ', body: ' + body + ')'
        callback(new Error(msg))
      }
    })
  },

  // scan repo for geojson files
  repo: function (user, repo, path, token, callback) {
    if (!user || !repo) {
      return callback(new Error('must specify at least user and repo'))
    }

    var self = this

    if (path) {
      // check the contents (checks for dirs as the path)
      var contentsUrl = 'repos/' + user + '/' + repo + '/contents/'
      if (token) contentsUrl += '?access_token=' + token

      return self.request(contentsUrl, function (err, data) {
        if (err) {
          var msg = 'Error requesting data from ' + contentsUrl + ': ' + err.message
          return callback(new Error(msg))
        }

        var isDir = false

        data.forEach(function (f) {
          if (f.name === path && f.type === 'dir') isDir = true
        })

        if (isDir) {
          var url = 'repos/' + user + '/' + repo + '/contents/' + path
          if (token) url += '?access_token=' + token

          return self.request(url, function (err, json) {
            if (err) return callback(err)

            var files = []

            json.forEach(function (file) {
              if (file.name.match(/geojson/)) {
                files.push(file)
              }
            })

            if (files.length) {
              var filesUrl = 'https://raw.github.com/' + user + '/' + repo + '/master/' + path + '/'
              return self.getRepoFiles(filesUrl, files, callback)
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
          self.request(url, cb)
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
    var url = 'repos/' + user + '/' + repo + '/contents'
    if (token) url += '?access_token=' + token

    self.request(url, function (err, json) {
      if (err) return callback(err)

      var files = []

      json.forEach(function (file) {
        if (file.name.match(/geojson/)) {
          files.push(file)
        }
      })

      if (files.length) {
        var filesUrl = 'https://raw.github.com/' + user + '/' + repo + '/master/'
        return self.getRepoFiles(filesUrl, files, callback)
      }

      callback(new Error('could not find any geojson files at ' + url))
    })
  },

  repoSha: function (user, repo, path, token, callback) {
    var url = 'repos/' + user + '/' + repo + '/contents/' + path
    if (token) url += '?access_token=' + token

    this.request(url, function (err, json) {
      if (err) return callback(err)
      if (json.message) return callback(new Error(json.message))
      if (json.updated_at) return callback(null, json.updated_at)
      callback(new Error('could not get sha for ' + url))
    })
  },

  getRepoFiles: function (url, files, callback) {
    var self = this
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
      self.request(url + f.name, function (err, json) {
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
  },

  gist: function (options, callback) {
    if (!options.id) return callback(new Error('missing option: id'))

    var url = 'gists/' + options.id
    if (options.token) url += '?access_token=' + options.token

    this.request(url, function (err, json) {
      if (err) callback(err)

      var geojson = []

      console.log(json)

      for (var f in json.files) {
        var file = json.files[f]

        try {
          var content = JSON.parse(file.content)
        } catch (e) {
          var msg = 'could not parse file contents of ' + file.filename + ': ' + e.message
          console.log(file.content)
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
  },

  gistSha: function (id, token, callback) {
    var url = 'gists/' + id
    if (token) url += '?access_token=' + token

    this.request(url, function (err, json) {
      if (err) return callback(err)
      if (json.message) return callback(new Error(json.message))
      if (json.updated_at) return callback(null, json.updated_at)
      callback(new Error('could not get sha for ' + url))
    })
  }
}
