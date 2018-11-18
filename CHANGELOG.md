# geohub change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.4] - 2018-11-17
### Fixed
* return callback in request handling when JSON parsing fails.

## [1.0.3] - 2015-10-22

### Added
* introduced support for fetching GeoJSON from files with an extension other than `.geojson` (ex: `.json`)

## [1.0.2] - 2015-10-01
### Fixed
* move `debug` a from devDependences to dependencies (oops)

## [1.0.1] - 2015-10-01
### Fixed
* 401 on unauthenticated requests ([#9](https://github.com/koopjs/geohub/issues/4))

### Changed
* `lib/request`: function params changed mimicking canonical request options `(options, callback)`
* `lib/request`: deleting `qs.access_token` when undefined to avoid github 401

### Added
* using `debug` package in `lib/request` for debug messages during development

## 1.0.0 - 2015-09-30
### Fixed
* bad errors for github API rate limits
* access token issues
* dependency issues
* broken tests
* madness

### Changed
* switched to `options` style for function parameters
  * e.g. `geohub.gist(options, callback)` instead of `geobhub.gist(id, token, callback)`
* using JavaScript Standard Style
* using tape for testing
* modularized & simplified code
* improved readme

### Added
* add support for specifying branch ([#4](https://github.com/koopjs/geohub/issues/4))

## 0.3.2 - 2014-08-11
* legacy release

[1.0.4]: https://github.com/koopjs/geohub/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/koopjs/geohub/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/koopjs/geohub/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/koopjs/geohub/compare/v1.0.0...v1.0.1
