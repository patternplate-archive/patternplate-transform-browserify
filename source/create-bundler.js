const browserify = require('browserify');
const watchify = require('watchify');

const createResolver = require('./create-resolver');
const getDependencyRegistry = require('./get-dependency-registry');

export default (options, context) => {
	options.fileCache = Object.values(context.file.dependencies || {})
		.reduce((fileCache, dependency) => {
			fileCache[dependency.path] = dependency.buffer || '// beep. boop';
			return dependency;
		}, {});

	options.plugin = options.plugin || [];
	options.plugin.push(watchify);
	options.cache = {};
	options.packageCache = {};

	const dependencies = getDependencyRegistry(context.file);
	const bundler = browserify(options);

	// TODO: PR for browserify allowing to override mopt.resolve
	// https://github.com/substack/node-browserify/blob/7fbaee2d1373f5f186bab98d80dbffaccd058d92/index.js#L460
	bundler._bresolve = createResolver(dependencies);

	context.transforms.forEach(transform => {
		const {fn, opts} = transform;
		if (typeof fn.configure === 'function') {
			bundler.transform(fn.configure(opts));
		} else {
			bundler.transform(fn, opts);
		}
	});

	return bundler;
};
