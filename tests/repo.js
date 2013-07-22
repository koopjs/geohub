var vows   = require('vows');
var assert = require('assert');

var Geohub = require('../');

var repo = 'hurricanes',
  user = 'colemanm',
  path = 'fl_2004_hurricanes';

vows.describe('Repo Access').addBatch({
  'When requesting geojson from a repo with geojson data are returned': {
    topic: function () {
      Geohub.repo( user, repo, path, this.callback);
    },
    'It should return the geojson': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.type, 'FeatureCollection');
    }
  }
}).export(module);
