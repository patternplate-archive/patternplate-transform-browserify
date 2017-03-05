# patternplate-transform-browserify [![stability][0]][1]

[![Greenkeeper badge](https://badges.greenkeeper.io/sinnerschrader/patternplate-transform-browserify.svg)](https://greenkeeper.io/)

[![npm version][2]][3] [![Travis branch][4]][5] [![Appveyor branch][6]][7]

Bundle JavaScript modules for browser consumption with patternplate

## Installation
```shell
npm install --save patternplate-transform-browserify browserify
```

## Configuration
```javascript
module.exports = {
	browserify: {
		opts: {
			debug: true
			// browserify options go here
		},
		vendors: [/* an array of vendors to bundle separately */]
		vendors: ['react', 'react-dom']
	}
};
```

---
Copyright 2016 by [SinnerSchrader Deutschland GmbH](https://github.com/sinnerschrader) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').


[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/patternplate-transform-browserify.svg?style=flat-square
[3]: https://npmjs.org/package/patternplate-transform-browserify
[4]: https://img.shields.io/travis/sinnerschrader/patternplate-transform-browserify/master.svg?style=flat-square
[5]: https://travis-ci.org/sinnerschrader/patternplate-transform-browserify
[6]: https://img.shields.io/appveyor/ci/marionebl/patternplate-transform-browserify/master.svg?style=flat-square
[7]: https://ci.appveyor.com/project/marionebl/patternplate-transform-browserify
