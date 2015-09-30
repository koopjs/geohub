var test = require('tape')
var Geohub = require('../')
var user = 'chelm'
var repo = 'grunt-geo'
var path = 'forks'

test('When requesting geojson from a repo with geojson', function (t) {
  Geohub.repo(user, repo, path, null, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.type, 'FeatureCollection', 'data is a FeatureCollection')
    t.ok(data.sha, 'data has sha property')
    t.end()
  })
})

test('When checking the sha of a file', function (t) {
  Geohub.repoSha(user, repo, 'forks.geojson', null, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(typeof data, 'string', 'data is a string')
    t.end()
  })
})

test('When only passing in a user/repo', function (t) {
  Geohub.repo(user, repo, null, null, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 3, 'data has length of 3')
    t.equal(data[0].name, 'forks.geojson', 'first object in data has name of forks.geojson')
    t.ok(data[0].sha, 'first object in data has sha property')
    t.end()
  })
})

test('When only passing in a user/repo with a path that is a dir', function (t) {
  Geohub.repo(user, repo, 'samples', null, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 7, 'data has length of 7')
    t.end()
  })
})
