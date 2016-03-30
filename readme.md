# patternplate-transform-browserify
[patternplate](/sinnerschrader/patternplate) patternplate transform creating browserify bundles.

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
