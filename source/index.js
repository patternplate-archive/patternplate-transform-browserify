import bundle from './bundle';
import createBundler from './create-bundler';
import loadTransforms from './load-transforms';
import rewriteImports from './rewrite-imports';

export default application => {
	return async (file, demo, configuration) => {
		const transformConfig = configuration.transforms || {};

		// load browserify transforms
		const transforms = loadTransforms(transformConfig, application);

		// create configured browserify bundler
		const bundler = createBundler(configuration.opts, transforms, application);

		// rewrite imports to global names
		const rewritten = rewriteImports(file);

		// bundle the rewritten file
		file.buffer = await bundle(bundler, rewritten);
		return file;
	};
};
