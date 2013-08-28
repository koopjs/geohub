var vows   = require('vows');
var assert = require('assert');

var Geohub = require('../');

var repo = 'grunt-geo',
  user = 'chelm',
  path = 'forks';

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
  },
  'when only passing in a user/repo': {
    topic: function () {
      Geohub.repo( user, repo, null, this.callback);
    },
    'It should return an array of geojson data': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.notEqual(data.length, 0);
      assert.equal(data.length, 3);
      assert.equal(data[0].name, 'collaborators.geojson');
    },
  }
}).export(module);
