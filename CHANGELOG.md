# geohub change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
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
