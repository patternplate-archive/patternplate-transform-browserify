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
			} catch (error) {
				application.log.error(`Unable to load browserify transform ${name}.`);
				throw error;
			}
		}, []);
