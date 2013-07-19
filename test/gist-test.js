var vows   = require('vows');
var assert = require('assert');

var Geohub = require('../');

var gist = 6021269;

vows.describe('Gist Access').addBatch({
  'When requesting a gist with geojson the data are returned': {
    topic: function () {
      Geohub.gist( gist , this.callback);
    },
    'It should return the geojson': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.type, 'FeatureCollection');
      assert.equal(data.features.length, 1);
    }
  }
});
