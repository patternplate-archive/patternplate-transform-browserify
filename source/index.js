import resolveDependencies from './resolve-dependencies';
import runBundler from './run-bundler';

export default function browserifyTransformFactory(application) {
	return async function browserifyTransform(file, demo, configuration) {
		const transformNames = Object.keys(configuration.transforms || {})
			.map(transformName => configuration.transforms[transformName].enabled ? transformName : false)
			.filter(Boolean);

		const transforms = transformNames.reduce((results, transformName) => {
			let transformFn;
			const transformConfig = configuration.transforms[transformName].opts || {};

			try {
				transformFn = require(transformName);
			} catch (error) {
				application.log.warn(`Unable to load browserify transform ${transformName}.`);
				application.log.error(error.stack);
			}

			results[transformName] = [transformFn, transformConfig];
			return results;
		}, {});

		const bundler = await resolveDependencies(file, configuration, application.cache);

		for (const transformName of Object.keys(transforms)) {
			const [transformFn, transformConfig] = transforms[transformName];
			if (typeof transformFn.configure === 'function') {
				bundler.transform(transformFn.configure(transformConfig));
			} else {
				bundler.transform(...transforms[transformName]);
			}
		}

		try {
			const bundled = await runBundler(bundler, configuration, file);
			const {buffer} = bundled;
			return {...file, buffer: buffer.toString('utf-8')};
		} catch (err) {
			err.file = file.path || err.fileName;
			throw err;
		}
	};
}
