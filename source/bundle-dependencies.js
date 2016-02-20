import bundleFile from './bundle-file';

export default (bundler, file) => {
	const dependencies = Object
		.entries(file.dependencies)
		.reduce((registry, entry) => {
			const [, dependency] = entry;
			const {pattern: {id}} = dependency;

			return {
				...registry,
				[id]: dependency
			};
		}, {});

	const bundled = Object
		.entries(dependencies)
		.map(entry => {
			const [, dependency] = entry;
			return bundleFile(bundler, dependency);
		});

	return bundled[bundled.length - 1];
};
