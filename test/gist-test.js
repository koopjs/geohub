var vows = require('vows')
var assert = require('assert')
var Geohub = require('../')
var gist1 = '6021269'
var gist2 = '45b401a452cd69e0d5f1'

vows.describe('Gist Access').addBatch({
  'When requesting a gist with geojson': {
    topic: function () {
      Geohub.gist({ id: gist1 }, this.callback)
    },
    'It should return the geojson': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(data.length, 1)
      assert.equal(data[0].type, 'FeatureCollection')
      assert.equal(data[0].features.length, 1)
      assert.notEqual(data[0].updated_at, null)
    }
  },

  // TODO: the gist for this file does not correspond to the test
  'When requesting a gist with many files': {
    topic: function () {
      Geohub.gist({ id: gist2 }, this.callback)
    },
    'It should return the geojson for each file': function (err, data) {
      console.log(err.message)
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(data.length, 2)
      assert.equal(data[0].name, 'map.geojson')
      assert.notEqual(data[0].updated_at, null)
      assert.equal(data[0].type, 'FeatureCollection')
      assert.equal(data[0].features.length, 1)
    }
  },
  'when getting the sha for a gist': {
    topic: function () {
      Geohub.gistSha(gist1, null, this.callback)
    },
    'It should return a string': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(typeof data, 'string')
    }
  }
}).export(module)
