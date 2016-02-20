import browserify from 'browserify';

export default (options, transforms, application) => {
	const bundler = browserify(options);

	for (const transform of transforms) {
		const {fn, opts, name} = transform;
		application.log.debug(`Applying browserify transform "${name}"`);
		if (typeof fn.configure === 'function') {
			bundler.transform(fn.configure(opts));
		} else {
			bundler.transform(fn, opts);
		}
	}

	return bundler;
};
