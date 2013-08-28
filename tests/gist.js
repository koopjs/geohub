var vows   = require('vows');
var assert = require('assert');

var Geohub = require('../');

var gist = 6021269;

vows.describe('Gist Access').addBatch({
  'When requesting a gist with geojson the data are returned': {
    topic: function () {
      Geohub.gist( { id: gist }, this.callback);
    },
    'It should return the geojson': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.length, 1);
      assert.equal(data[0].type, 'FeatureCollection');
      assert.equal(data[0].features.length, 1);
    }
  },
  'When requesting a gist with many files': {
    topic: function () {
      Geohub.gist( { id: 6178185 }, this.callback);
    },
    'It should return the geojson for each file': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.length, 2);
      assert.equal(data[0].name, 'map.geojson');
      //assert.equal(data[0].type, 'FeatureCollection');
      //assert.equal(data[0].features.length, 1);
    }
  }
}).export(module);
