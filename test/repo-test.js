var test = require('tape')
var Geohub = require('../')
var user = 'chelm'
var repo = 'grunt-geo'
var path = 'forks'
var token = process.env.GITHUB_TOKEN

test('When requesting geojson from a repo with geojson', function (t) {
  Geohub.repo(user, repo, path, token, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.type, 'FeatureCollection', 'data is a FeatureCollection')
    t.ok(data.sha, 'data has sha property')
    t.end()
  })
})

test('When checking the sha of a file', function (t) {
  Geohub.repoSha(user, repo, 'forks.geojson', token, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(typeof data, 'string', 'data is a string')
    t.end()
  })
})

test('When only passing in a user/repo', function (t) {
  Geohub.repo(user, repo, null, token, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 3, 'data has length of 3')
    t.ok(data[0].sha, 'object 1 has sha property')
    t.ok(data[1].sha, 'object 2 has sha property')
    t.ok(data[2].sha, 'object 3 has sha property')
    t.equal(data[0].type, 'FeatureCollection', 'object 1 is FeatureCollection')
    t.equal(data[1].type, 'FeatureCollection', 'object 2 is FeatureCollection')
    t.equal(data[2].type, 'FeatureCollection', 'object 3 is FeatureCollection')
    t.ok(data[0].features.length > 0, 'object 1 has features')
    t.ok(data[1].features.length > 0, 'object 2 has features')
    t.ok(data[2].features.length > 0, 'object 3 has features')
    t.end()
  })
})

test('When only passing in a user/repo with a path that is a dir', function (t) {
  Geohub.repo(user, repo, 'samples', token, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 7, 'data has length of 7')
    t.end()
  })
})
