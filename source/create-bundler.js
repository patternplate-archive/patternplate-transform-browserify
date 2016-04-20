import browserify from 'browserify';

export default (options, transforms) => {
	const bundler = browserify(options);

	for (const transform of transforms) {
		const {fn, opts} = transform;
		if (typeof fn.configure === 'function') {
			bundler.transform(fn.configure(opts));
		} else {
			bundler.transform(fn, opts);
		}
	}

	return bundler;
};

module.change_code = 1; // eslint-disable-line camelcase
