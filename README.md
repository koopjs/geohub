# geohub

> GeoJSON extractor for Github repos and gists.

[![npm version][npm-img]][npm-url]
[![build status][travis-image]][travis-url]

[npm-img]: https://img.shields.io/npm/v/geohub.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/geohub
[travis-image]: https://img.shields.io/travis/koopjs/geohub/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/geohub

Extracts and parses GeoJSON files from Github repos and gists using the Github API.

## Install

```
npm install geohub
```

## Usage

```js
geohub = require('geohub')

var user = 'chelm'
var repo = 'grunt-geo'
var path = 'forks'

// Extract GeoJSON from a specific path in a repository
geohub.repo({
  user: user,  // username
  repo: repo,  // repository
  path: path,  // path to file
  token: token // github API token
}, function (err, data) {
  if (err) throw err
  console.log(data)
  // => data is an array of geojson objects
})

// Omit the 'path' option to extract all GeoJSON files from a repository
geohub.repo({
  user: user,  // username
  repo: repo,  // repository
  token: token // github API token
}, function (err, data) {
  if (err) throw err
  console.log(data)
  // => data is an array of geojson objects
})

// Check a file's SHA (useful for caching)
geohub.repoSha({
  user: user,  // username
  repo: repo,  // repository
  path: path,  // path to file
  token: token // github API token
}, function (err, sha) {
  if (err) throw err
  console.log(sha)
  // => SHA string
})

// Extract GeoJSON from a gist
geohub.gist({
  id: 6021269, // gist ID
  token: token // github API token
}, function (err, data) {
  if (err) throw err
  console.log(data)
  // => data is an array of geojson objects
})
```

## Test

Geohub uses [tape](https://github.com/substack/tape) for testing. It is recommended to create your own Github [access token](https://github.com/settings/tokens) for use during testing to ensure you will not hit Github API rate limits.

```
GITHUB_TOKEN=XXXXXX npm test
```

## License

[MIT](LICENSE)
