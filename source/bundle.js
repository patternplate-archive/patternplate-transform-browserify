import bundleDependencies from './bundle-dependencies';
import bundleFile from './bundle-file';

export default (bundler, file) => {
	const bundled = bundleFile(bundler, file, true);
	const resolved = bundleDependencies(bundled, file);

	return new Promise((resolve, reject) => {
		resolved.bundle((err, result) => {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};
