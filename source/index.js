import {resolve} from 'try-require';
import bundle from './bundle';
import createBundler from './create-bundler';
import loadTransforms from './load-transforms';
import rewriteImports from './rewrite-imports';
import promiseBundle from './promise-bundle';
import findDependencies from './find-dependencies';
import freshestMtime from './freshest-mtime';

export default application => {
	return async (file, demo, configuration) => {
		const {cache} = application;
		const {
			transforms: transformConfig = {},
			vendors: userVendors = [],
			opts
		} = configuration;

		const vendors = findDependencies(file, cache, userVendors);
		const vendorPaths = vendors.map(vendor => resolve(vendor));
		const vendorMtime = freshestMtime(vendorPaths) || new Date(0);

		const vendorCacheKey = `browserify:vendor:${vendors.join(':')}`;
		const applicationCacheKey = `browserify:application:${file.path}`;

		// load browserify transforms
		const transforms = loadTransforms(transformConfig, application);

		// combine all vendors into one external bundle
		const vendorBundler = createBundler({...opts, noParse: vendors}, []);
		vendorBundler.require(vendors);

		// create configured browserify bundler
		const bundler = createBundler(opts, transforms, application);
		bundler.external(vendors);

		// rewrite imports to global names
		const rewritten = rewriteImports(file);

		const [vendorCode, applicationCode] = await Promise.all([
			cache.get(vendorCacheKey, vendorMtime) || promiseBundle(vendorBundler),
			cache.get(applicationCacheKey, file.mtime) || bundle(bundler, rewritten)
		]);

		cache.set(vendorCacheKey, vendorMtime, vendorCode);
		cache.set(applicationCacheKey, file.mtime, applicationCode);

		// bundle the rewritten file
		file.buffer = `${vendorCode}\n\n${applicationCode}`;
		return file;
	};
};
