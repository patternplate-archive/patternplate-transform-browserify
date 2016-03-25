import bundle from './bundle';
import createBundler from './create-bundler';
import loadTransforms from './load-transforms';
import rewriteImports from './rewrite-imports';
import promiseBundle from './promise-bundle';

const defaultVendors = ['react', 'react-dom', 'classnames', 'classnames/bind'];

export default application => {
	return async (file, demo, configuration) => {
		const vendorCacheKey = ['browserify', 'vendor'].join(':');
		const applicationCacheKey = ['browserify', 'application', file.path].join(':');

		const transformConfig = configuration.transforms || {};

		// load browserify transforms
		const transforms = loadTransforms(transformConfig, application);

		// create bundler for external vendors
		const vendors = configuration.vendors || defaultVendors;
		const vendorBundler = createBundler(configuration.opts, []);
		vendors.forEach(lib => vendorBundler.require(lib));

		// create configured browserify bundler
		const bundler = createBundler(configuration.opts, transforms, application);
		bundler.external(vendors);

		// rewrite imports to global names
		const rewritten = rewriteImports(file);

		const vendorCode = application.cache.get(vendorCacheKey, file.mtime) ||
			await promiseBundle(vendorBundler);

		const applicationCode = application.cache.get(applicationCacheKey, file.mtime) ||
			await bundle(bundler, rewritten);

		application.cache.set(vendorCacheKey, file.mtime, vendorCode);
		application.cache.set(applicationCacheKey, file.mtime, applicationCode);

		// bundle the rewritten file
		file.buffer = `${vendorCode}\n\n${applicationCode}`;
		return file;
	};
};
