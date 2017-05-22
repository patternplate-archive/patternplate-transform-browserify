<a name="1.2.2"></a>
## [1.2.2](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.2.1...v1.2.2) (2017-05-22)


### Bug Fixes

* ensure usage of mutated config if any ([8b3a052](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/8b3a052))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.7...v1.2.1) (2017-05-22)


### Bug Fixes

* avoid shared dependency issues ([80461b4](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/80461b4))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.7...v1.2.0) (2017-05-17)


### Features

* use server resource queue ([e640cb9](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/e640cb9))



<a name="1.1.7"></a>
## [1.1.7](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.6...v1.1.7) (2016-11-17)


### Bug Fixes

* ensure browserfiy reads from dependency cache ([2d9c337](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/2d9c337))



<a name="1.1.6"></a>
## [1.1.6](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.4...v1.1.6) (2016-11-16)


### Bug Fixes

* revert watchify introduction ([1b85e97](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/1b85e97))


### Performance Improvements

* speed up watchify usage ([#32](https://github.com/sinnerschrader/patternplate-transform-browserify/issues/32)) ([757812d](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/757812d))



<a name="1.1.5"></a>
## [1.1.5](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.4...v1.1.5) (2016-11-15)


### Performance Improvements

* speed up watchify usage ([#32](https://github.com/sinnerschrader/patternplate-transform-browserify/issues/32)) ([757812d](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/757812d))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.3...v1.1.4) (2016-11-13)


### Bug Fixes

* avoid es5/2015 module interop issues ([08205ff](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/08205ff))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.1...v1.1.3) (2016-11-12)


### Bug Fixes

* construct file cache correctly ([#22](https://github.com/sinnerschrader/patternplate-transform-browserify/issues/22)) ([3871ed2](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/3871ed2))
* harden against missing .opts ([dc6603f](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/dc6603f)), closes [sinnerschrader/patternplate#123](https://github.com/sinnerschrader/patternplate/issues/123)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.1.1...v1.1.2) (2016-11-12)


### Bug Fixes

* construct file cache correctly ([#22](https://github.com/sinnerschrader/patternplate-transform-browserify/issues/22)) ([3871ed2](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/3871ed2))
* harden against missing .opts ([dc6603f](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/dc6603f)), closes [sinnerschrader/patternplate#123](https://github.com/sinnerschrader/patternplate/issues/123)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v1.0.1...v1.1.1) (2016-09-28)


### Features

* enable vendor splitting (#13) ([e0b1ce8](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/e0b1ce8))
* resolve browserify transforms from cwd ([a61409c](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/a61409c))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.2...v1.1.0) (2016-09-25)


### Bug Fixes

* move meta data into vinyl file (#5) ([2861148](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/2861148))

### Features

* enable vendor splitting (#13) ([e0b1ce8](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/e0b1ce8))
* resolve browserify transforms from cwd ([a61409c](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/a61409c))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.2...v1.0.1) (2016-09-18)


### Bug Fixes

* move meta data into vinyl file (#5) ([2861148](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/2861148))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.2...v1.0.0) (2016-09-16)




<a name="0.3.3"></a>
## [0.3.3](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.2...v0.3.3) (2016-09-16)




<a name="0.3.2"></a>
## [0.3.2](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.1...v0.3.2) (2016-04-20)


### Bug Fixes

* **generation:** bundle all files seperately for optimal cache usage ([f8aeac4](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/f8aeac4))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.3.0...v0.3.1) (2016-04-20)




<a name="0.3.0"></a>
# [0.3.0](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.2.4...v0.3.0) (2016-04-19)


### Bug Fixes

* handle files without dependencies ([0918f86](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/0918f86))
* handle sources without sourcemaps ([13c8b42](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/13c8b42))

### Features

* run browserify bundlers in parallel ([06fa901](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/06fa901))
* search automatically and recursively for dependencies ([c4d012c](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/c4d012c))
* split out vendor dependencies ([ac1c0d7](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/ac1c0d7))
* Use mtime of youngest vendor to validate cache ([9d50bc2](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/9d50bc2))

### Performance Improvements

* split bundles further for better caching ([de6c0b6](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/de6c0b6))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.2.3...v0.2.4) (2016-03-28)


### Bug Fixes

* don't fail if file has no dependencies ([4611ad7](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/4611ad7))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.2.2...v0.2.3) (2016-02-22)


### Bug Fixes

* detect npm package availability correctly ([b7a2e40](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/b7a2e40))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.2.1...v0.2.2) (2016-02-20)


### Bug Fixes

* squash dependencies recursively ([2b8ef1a](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/2b8ef1a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.2.0...v0.2.1) (2016-02-20)


### Performance Improvements

* only add dependencies to bundler if imported ([7912e43](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/7912e43))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/sinnerschrader/patternplate-transform-browserify/compare/v0.1.0...v0.2.0) (2016-02-15)


### Features

* add default set of transforms ([d67e942](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/d67e942))



<a name="0.1.0"></a>
# 0.1.0 (2016-02-15)


### Features

* add browserify transform ([7c00798](https://github.com/sinnerschrader/patternplate-transform-browserify/commit/7c00798))




---
Copyright 2016 by [SinnerSchrader Deutschland GmbH](https://github.com/sinnerschrader) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
