export default (configuration, application) =>
	Object.entries(configuration || {})
		.filter(transformEntry => {
			const [, transform] = transformEntry;
			return transform.enabled;
		})
		.reduce((results, transformEntry) => {
			const [name, transform] = transformEntry;
			const {opts} = transform;
			try {
				const fn = require(name);
				return [...results, {
					fn,
					name,
					opts
				}];
			} catch (err) {
				application.log.error(`Unable to load browserify transform ${name}.`);
				throw err;
			}
		}, []);

module.change_code = 1; // eslint-disable-line camelcase
