var test = require('tape')
var geohub = require('../')
var gist1 = '6021269'
var gist2 = '45b401a452cd69e0d5f1'
var gist3 = 'c82a80ee4c5b91889efe'
var token = process.env.GITHUB_TOKEN

test('When requesting a gist with geojson', function (t) {
  geohub.gist({ id: gist1, token: token }, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 1, 'data has length of 1')
    t.equal(data[0].type, 'FeatureCollection', 'data contains FeatureCollection geojson object')
    t.equal(data[0].features.length, 1, 'FeatureCollection has a feature')
    t.ok(data[0].updated_at, 'FeatureCollection has updated_at property')
    t.end()
  })
})

test('When requesting a gist with a truncated file', function (t) {
  geohub.gist({ id: gist2, token: token }, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data[0].name, 'overpass.geojson', 'file is overpass.geojson')
    t.equal(data[0].type, 'FeatureCollection', 'data contains FeatureCollection geojson object')
    t.ok(data[0].features.length > 0, 'FeatureCollection has features')
    t.ok(data[0].updated_at, 'FeatureCollection has updated_at property')
    t.end()
  })
})

test('When requesting a gist with two geojson files', function (t) {
  geohub.gist({ id: gist3, token: token }, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(data.length, 2, 'two geojson files are returned')
    t.equal(data[0].type, 'FeatureCollection', 'first object is FeatureCollection')
    t.equal(data[1].type, 'FeatureCollection', 'second object is FeatureCollection')
    t.ok(data[0].features.length > 0, 'FeatureCollection 1 has features')
    t.ok(data[0].features.length > 0, 'FeatureCollection 2 has features')
    t.ok(data[0].updated_at, 'FeatureCollection 1 has updated_at property')
    t.ok(data[0].updated_at, 'FeatureCollection 2 has updated_at property')
    t.end()
  })
})

test('When getting the sha for a gist', function (t) {
  geohub.gistSha({ id: gist1, token: token }, function (err, data) {
    t.error(err, 'does not error')
    t.ok(data, 'data exists')
    t.equal(typeof data, 'string', 'data is a string')
    t.end()
  })
})

if (token) {
  test('When making a request without a token', function (t) {
    geohub.gist({ id: gist1 }, function (err, data) {
      t.error(err, 'does not error')
      t.ok(data, 'data exists')
      t.equal(data.length, 1, 'data has length of 1')
      t.equal(data[0].type, 'FeatureCollection', 'data contains FeatureCollection geojson object')
      t.equal(data[0].features.length, 1, 'FeatureCollection has a feature')
      t.ok(data[0].updated_at, 'FeatureCollection has updated_at property')
      t.end()
    })
  })
}
