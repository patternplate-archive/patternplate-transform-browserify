import bundleDependencies from './bundle-dependencies';
import bundleFile from './bundle-file';
import promiseBundle from './promise-bundle';

export default (bundler, file) => {
	const bundled = bundleFile(bundler, file, true);
	const resolved = bundleDependencies(bundled, file);

	return promiseBundle(resolved);
};
