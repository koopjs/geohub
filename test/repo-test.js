var vows = require('vows')
var assert = require('assert')
var Geohub = require('../')
var user = 'chelm'
var repo = 'grunt-geo'
var path = 'forks'

vows.describe('Repo Access').addBatch({
  'When requesting geojson from a repo with geojson': {
    topic: function () {
      Geohub.repo(user, repo, path, null, this.callback)
    },
    'It should return the geojson': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(data.type, 'FeatureCollection')
      assert.notEqual(data.sha, null)
    }
  },
  'when checking the sha of a file': {
    topic: function () {
      Geohub.repoSha(user, repo, 'forks.geojson', null, this.callback)
    },
    'It should return a sha': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(data, 'e3729d510e786be80126225579214a78cf06e7a1')
    }
  },
  'when only passing in a user/repo': {
    topic: function () {
      Geohub.repo(user, repo, null, null, this.callback)
    },
    'It should return an array of geojson data': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.notEqual(data.length, 0)
      assert.equal(data.length, 3)
      assert.equal(data[0].name, 'collaborators.geojson')
      assert.notEqual(data[0].sha, null)
    }
  },
  'when only passing in a user/repo with a path that is a dir': {
    topic: function () {
      Geohub.repo(user, repo, 'samples', null, this.callback)
    },
    'It should return an array of geojson data': function (err, data) {
      assert.equal(err, null)
      assert.notEqual(data, null)
      assert.equal(data.length, 7)
    }
  }

}).export(module)
